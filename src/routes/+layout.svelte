<script>
  // Global StyleSheet
  import "../global.css";
</script>

<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SuperTicTacToe - I Challenge You To Win!!!</title>
  </head>
  <body class="bg-zinc-900 overflow-x-hidden text-white">
    <main class="overflow-hidden grid place-items-center w-screen min-h-screen">
      <section>
        <slot />
      </section>
    </main>
  </body>
</html>
