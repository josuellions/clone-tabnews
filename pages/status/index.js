import useSWR from "swr";

export default function StatusPage() {
  return (
    <>
      <h2 style={{ fontFamily: "sans-serif", padding: "0 10rem" }}>Status</h2>
      <UpdateAt />
    </>
  );
}

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();

  return responseBody;
}

function UpdateAt() {
  const { isLoading, data } = useSWR("api/v1/status", fetchAPI, {
    refreshInterval: 2000,
    //dedupingInterval: 100000,
  });

  let updateAtText = "Carregando...";
  let status = "🔴 Inativo";

  //return <pre>{JSON.stringify(data, null, 2)}</pre>;

  if (!isLoading && data) {
    updateAtText = new Date(data.update_at).toLocaleString("pt-BR");
    status = "🟢 Ativo";
  }

  return (
    <div
      style={{
        fontFamily: "sans-serif",
        background: "#eee",
        padding: "1.2rem",
        maxWidth: "20vw",
        borderRadius: ".5rem",
      }}
    >
      <p>
        <strong>📅 Última atualização:</strong> {updateAtText}
      </p>
      <p>
        <strong>🌐 Máximo conexões:</strong>{" "}
        {data?.dependencies.database.max_connections}
      </p>
      <p>
        <strong>🌀 Conexões abertas:</strong>{" "}
        {data?.dependencies.database.opened_connections}
      </p>
      <p>
        <strong>🔖 Versão banco:</strong> {data?.dependencies.database.version}
      </p>
      <p>
        <strong>{status}</strong>
      </p>
    </div>
  );
}
