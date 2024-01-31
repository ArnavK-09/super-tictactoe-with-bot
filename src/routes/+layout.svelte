<script>
  // Global StyleSheet
  import "../global.css";
</script>

<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SuperTicTacToe - I Challenge You To Win!!!</title>
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>❎</text></svg>">
  </head>
  <body class="bg-zinc-900 overflow-x-hidden text-white">
    <main class="overflow-hidden grid place-items-center w-screen min-h-screen">
      <section>
        <slot />
      </section>
    </main>
  </body>
</html>
