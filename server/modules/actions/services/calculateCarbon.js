export default {
  name: 'Generate Carbon Report',
  description: "Return the tally of the structure's embodied energy in GWP.",
  icon: 'mdi-leaf',
  arguments: [
    {
      id: 'model',
    },
  ],
  outputs: [{ name: 'Embodied Carbon' }, { name: 'Breakdown' }],
  run: async ({ inputs, context }) => {
    /*
https://github.com/specklesystems/SpeckleHackathon-SpeckleReports/tree/master/server/src/speckle_calculator/core
    */
    const MATERIAL_PROPERTIES = {
      Aluminium: { density: 2700, kgCO2e: 9.16 },
      Concrete: { density: 2400, kgCO2e: 0.12 },
      Steel: { density: 7800, kgCO2e: 1.46 },
      Timber: { density: 650, kgCO2e: 0.72 },
    }
    const FACTORS = { mm: 1e-9, cm: 1e-6, m: 1, km: 1e9 }

    const toCubicMeters = (element) => {
      if (!FACTORS[element.units])
        throw new Error(
          `Unknown unit: "${element.units}". Could not convert it to m^3.`
        )
      element.volume *= FACTORS[element.units]
      element.units = 'm'

      return element
    }

    const calculateGWP = (element) => {
      const { density, kgCO2e } = MATERIAL_PROPERTIES[element.material]
      element.GWP = element.volume * density * kgCO2e
      return element
    }

    const tally = (previous, current) => (previous += current.GWP)

    const sortMaterials = (previous, current) => {
      if (!previous.has(current.material)) previous.set(current.material, [])
      previous.get(current.material).push({
        volume: current.volume,
        units: current.units,
        GWP: current.GWP,
      })
      return previous
    }

    const elements = await inputs.model['@data']
      .flat()
      .filter(
        (element) =>
          MATERIAL_PROPERTIES[element.material] &&
          element.volume &&
          element.units
      )
      .map(toCubicMeters)
      .map(calculateGWP)

    const breakdown = new Map(
      Array.from(elements.reduce(sortMaterials, new Map()), ([k, v]) => [
        k,
        v.reduce(tally, 0),
      ])
    )

    const report = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>Embodied Carbon Report</title>
        <script src="https://d3js.org/d3.v7.min.js"></script>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-stone-50 p-6">
        <div class="bg-white border border-stone-200 container divide-y mx-auto pt-6 rounded-md shadow-xl">
          <div class="px-6">
            <h1 class="text-4xl font-bold mb-3">Embodied Carbon Report</h1>
            <p class="text-lg text-stone-500 mb-3">
              The structure's <em>Global Warming Potential</em> in kgCO<sub class="font-medium">2</sub> equivalents.
            </p>
            <div class="text-sm tracking-wide mb-4">
              <a href="${context.serverUrl}/streams/${
      context.streamId
    }" class="border border-lime-600 hover:border-lime-700 inline-block my-1 mr-1 px-2 rounded-full text-lime-600 hover:text-lime-700 font-mono">
                Stream ${context.commit.id}
              </a>
              <a href="${context.serverUrl}/streams/${
      context.streamId
    }/commits/${
      context.commit.id
    }" class="border border-lime-600 hover:border-lime-700 inline-block my-1 mr-1 px-2 rounded-full text-lime-600 hover:text-lime-700 font-mono">
                Commit ${context.streamId}
              </a>
            </div>
          </div>
          <div class="flex flex-row gap-6 px-6 py-3">
            <div id="d3" class="flex basis-2/3 place-content-center py-6"></div>
            <div class="basis-1/3 flex place-content-center">
              <table class="border-collapse border border-slate-400 my-auto">
                <thead>
                  <tr>
                    <th class="bg-stone-50 border border-stone-300 px-2 py-1 w-1/2">Material</th>
                    <th class="bg-stone-50 border border-stone-300 px-2 py-1 w-1/2">GWP</th>
                  </tr>
                </thead>
                <tbody>
                  ${[...breakdown.entries()]
                    .sort(([key0, val0], [key1, val1]) => val0 - val1)
                    .map(
                      ([name, gwp]) =>
                        `<tr><td  class="border border-stone-300 px-2 py-1">${name}</td><td  class="border border-stone-300 px-2 py-1">${gwp}</td></tr>`
                    )
                    .join('')}
                </tbody>
              </table>
            </div>
          </div>
          <div class="px-6 py-3">
            <p class="text-stone-700 text-sm tracking-wide">
              Created ${new Date(
                Date.now()
              ).toISOString()} with <a class="text-lime-600 underline" href>Speckle Actions</a> by <a class="text-lime-600 underline" href>Carbon Calculator</a>.
            </p>
          </div>
        </div>

        <script type="text/javascript">

          // Copyright 2021 Observable, Inc.
          // Released under the ISC license.
          // https://observablehq.com/@d3/pie-chart
          function PieChart(data, {
            name = ([x]) => x,  // given d in data, returns the (ordinal) label
            value = ([, y]) => y, // given d in data, returns the (quantitative) value
            title, // given d in data, returns the title text
            width = 640, // outer width, in pixels
            height = 400, // outer height, in pixels
            innerRadius = 0, // inner radius of pie, in pixels (non-zero for donut)
            outerRadius = Math.min(width, height) / 2, // outer radius of pie, in pixels
            labelRadius = (innerRadius * 0.2 + outerRadius * 0.8), // center radius of labels
            format = ",", // a format specifier for values (in the label)
            names, // array of names (the domain of the color scale)
            colors, // array of colors for names
            stroke = innerRadius > 0 ? "none" : "white", // stroke separating widths
            strokeWidth = 1, // width of stroke separating wedges
            strokeLinejoin = "round", // line join of stroke separating wedges
            padAngle = stroke === "none" ? 1 / outerRadius : 0, // angular separation between wedges
          } = {}) {
            // Compute values.
            const N = d3.map(data, name);
            const V = d3.map(data, value);
            const I = d3.range(N.length).filter(i => !isNaN(V[i]));

            // Unique the names.
            if (names === undefined) names = N;
            names = new d3.InternSet(names);

            // Chose a default color scheme based on cardinality.
            if (colors === undefined) colors = d3.schemeSpectral[names.size];
            if (colors === undefined) colors = d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), names.size);

            // Construct scales.
            const color = d3.scaleOrdinal(names, colors);

            // Compute titles.
            if (title === undefined) {
              const formatValue = d3.format(format);
              title = i => \`\${N[i]}\n\${formatValue(V[i])}\`;
            } else {
              const O = d3.map(data, d => d);
              const T = title;
              title = i => T(O[i], i, data);
            }

            // Construct arcs.
            const arcs = d3.pie().padAngle(padAngle).sort(null).value(i => V[i])(I);
            const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
            const arcLabel = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius);

            const svg = d3.create("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("viewBox", [-width / 2, -height / 2, width, height])
                .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

            svg.append("g")
                .attr("stroke", stroke)
                .attr("stroke-width", strokeWidth)
                .attr("stroke-linejoin", strokeLinejoin)
              .selectAll("path")
              .data(arcs)
              .join("path")
                .attr("fill", d => color(N[d.data]))
                .attr("d", arc)
              .append("title")
                .text(d => title(d.data));

            svg.append("g")
                .attr("font-family", "sans-serif")
                .attr("font-size", 10)
                .attr("text-anchor", "middle")
              .selectAll("text")
              .data(arcs)
              .join("text")
                .attr("transform", d => \`translate(\${arcLabel.centroid(d)})\`)
              .selectAll("tspan")
              .data(d => {
                const lines = \`\${title(d.data)}\`.split(/\\n/);
                return (d.endAngle - d.startAngle) > 0.25 ? lines : lines.slice(0, 1);
              })
              .join("tspan")
                .attr("x", 0)
                .attr("y", (_, i) => \`\${i * 1.1}em\`)
                .attr("font-weight", (_, i) => i ? null : "bold")
                .text(d => d);

            return Object.assign(svg.node(), {scales: {color}});
          }

          const data = ${JSON.stringify(
            [...breakdown.entries()].sort(
              ([key0, val0], [key1, val1]) => val1 - val0
            )
          )};
          console.log(data)

          chart = PieChart(data, {
            name: ([name, value]) => name,
            value: ([name, value]) => value,
            width: 500,
            height: 500
          })

          const div = document.querySelector('#d3');
          div.appendChild(chart);

        </script>

      </body>
    </html>`

    return {
      'Embodied Carbon': elements.reduce(tally, 0),
      Breakdown: breakdown,
      report,
    }
  },
}
