const { exec } = require("node:child_process");

function checkPostgres() {
  exec("docker exec postgres-dev pg_isready --host localhost", handleReturn);

  function handleReturn(error, stdout) {
    if (stdout.search("accepting connections") === -1) {
      //console.log("Não está aceitando conexão ainda!");
      process.stdout.write(".");
      checkPostgres();
      return;
    }

    console.log("\n🟢 Posgres está pronto e aceitando conexões!\n\n");
  }
}

//console.log("\n\n🔴 Aguardando postgres aceitar conexões...");
process.stdout.write("\n\n🔴 Aguardando postgres aceitar conexões");
checkPostgres();
