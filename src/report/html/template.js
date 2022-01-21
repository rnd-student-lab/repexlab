const template = `\
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>

  <script src="https://cdn.plot.ly/plotly-2.8.3.min.js"></script>

  <title><%= title %></title>
</head>
<body>

<div class="container">

  <h1 class="report-title"><%= title %></h1>
  <hr/>

  <% for (let category in charts) { %>
    <h2 class="category-title"><%= category %></h2>

    <% for (let i in charts[category]) { %>
      <h3 class="chart-title"><%= charts[category][i].chart %></h3>
      <div id="<%= category %>_<%= i %>"></div>
      <script>
        Plotly.newPlot("<%= category %>_<%= i %>", [{
              x: <%- JSON.stringify(charts[category][i].x) %>,
              y: <%- JSON.stringify(charts[category][i].y) %>,
            }], <%- JSON.stringify(layout) %>, <%- JSON.stringify(config) %>)
      </script>
      <hr/>
    <% } %>
  <% } %>
</div>

</body>
</html>
`;

export default template;
