function parseData(str) {
  if (typeof str !== "string") return "**/**/****";
  const s = str.trim();

  const pad = (n) => n.toString().padStart(2, "0");

  // 1) Formato yyyymmddhhmmss -> 20190405000000
  if (/^\d{14}$/.test(s)) {
    const ano = Number(s.slice(0, 4));
    const mesIndex = Number(s.slice(4, 6)) - 1;
    const dia = Number(s.slice(6, 8));
    const hora = Number(s.slice(8, 10));
    const min = Number(s.slice(10, 12));
    const seg = Number(s.slice(12, 14));
    const d = new Date(ano, mesIndex, dia, hora, min, seg);
    if (isNaN(d)) return "**/**/****";
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }

  // 2) Formato dd/mm/yyyy -> 04/07/2025
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(s)) {
    const [dia, mes, ano] = s.split('/').map(Number);
    const d = new Date(ano, mes - 1, dia);
    if (isNaN(d)) return "**/**/****";
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
  }

  // 3) ISO 8601 com T (com ou sem Z) -> 2025-07-04T22:13:38.539Z
  if (/^\d{4}-\d{2}-\d{2}T/.test(s)) {
    const d = new Date(s);
    if (isNaN(d)) return "**/**/****";
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }

  // 4) ISO date simples YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const [ano, mes, dia] = s.split('-').map(Number);
    const d = new Date(ano, mes - 1, dia);
    if (isNaN(d)) return "**/**/****";
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
  }

  // Caso nenhum formato reconhecido
  return "**/**/****";
}


function applyTheme() {
  const theme = localStorage.getItem("theme") || "light";
  document.body.className = theme;

  const toggle = document.getElementById("theme-toggle");
  if (toggle) {
    toggle.checked = theme === "dark";
  }
}

function setupThemeToggle() {
  const toggle = document.getElementById("theme-toggle");
  if (toggle) {
    toggle.addEventListener("change", () => {
      const newTheme = toggle.checked ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      applyTheme();
    });
  }
}

applyTheme();
setupThemeToggle();

if (window.location.pathname.includes("login.html")) {
  window.login = function () {
    const email = document.getElementById("email").value.trim();
    const pass = document.getElementById("password").value.trim();
    const redirect = document.getElementById("redirect").value;

    if (typeof window.env === "undefined") {
      document.getElementById("error").textContent = "⚠️ Erro ao carregar variáveis de ambiente.";
      return;
    }

    const { ALLOWED_USER1, ALLOWED_PASS1, ALLOWED_USER2, ALLOWED_PASS2, AUTHORIZED } = window.env;

    if (
      (email === ALLOWED_USER1 && pass === ALLOWED_PASS1) ||
      (email === ALLOWED_USER2 && pass === ALLOWED_PASS2)
    ) {
      localStorage.setItem("authenticated", "true");
      localStorage.setItem("loginTime", Date.now().toString());
      window.location.href = redirect || "home.html";
    } else {
      document.getElementById("error").textContent = "❌ Credenciais inválidas.";
    }
  };
}

if (["home.html", "dashboard.html", "datajud.html"].some(p => window.location.pathname.includes(p))) {
  const isAuth = localStorage.getItem("authenticated") === "true";
  const loginTime = parseInt(localStorage.getItem("loginTime") || "0");
  const now = Date.now();
  const expired = now - loginTime > 30 * 60 * 1000;

  if (!isAuth || expired) {
    localStorage.removeItem("authenticated");
    localStorage.removeItem("loginTime");
    window.location.href = "login.html";
  }

  window.logout = function () {
    localStorage.removeItem("authenticated");
    localStorage.removeItem("loginTime");
    window.location.href = "login.html";
  };
}

// Página de consulta de processo
if (window.location.pathname.includes("datajud.html")) {
  window.searchProcess = async function () {
    const numeroInput = document.getElementById("processo");
    const numero = numeroInput.value.trim().replace(/\D/g, '');;
    const container = document.getElementById("result-container");

    container.innerHTML = "";

    if (!numero) {
      container.innerHTML = `<p class="error">❌ Informe o número do processo.</p>`;
      return;
    }

    container.innerHTML = `
      <div class="result-card fade-in">
        <p>🔄 Carregando…</p>
      </div>
    `;

    try {
      const trib = document.getElementById("tribunal").value;
      const { ALLOWED_USER1, ALLOWED_PASS1, ALLOWED_USER2, ALLOWED_PASS2, AUTHORIZED } = window.env;
      const url_source = encodeURIComponent("https://api-publica.datajud.cnj.jus.br/api_publica_"+trib+"/_search");
      const url_proxy = "https://corsproxy.io/?url=" + url_source;

      const resp = await fetch(url_proxy, {
        method: "POST",
        headers: {
          "Authorization": AUTHORIZED,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: {
            match: {
              numeroProcesso: numero,
            },
          },
        }),
      });

      if (!resp.ok) throw new Error(`Status ${resp.status}`);

      const json = await resp.json();
      const hits = json.hits?.hits || [];

      if (hits.length === 0) {
        container.innerHTML = `<p class="error">❌ Processo não encontrado.</p>`;
        return;
      }

      const src = hits[0]._source;
      const assuntosTodos = src.assuntos.map(a => `${a.codigo} - ${a.nome}`);
      const assuntosFormatados = assuntosTodos.join(", ");
      //const dataAjuizamentoRaw = src.dataAjuizamento;
      const dataAjuizamento = parseData(src.dataAjuizamento);
      //const dataUltimaAtual = src.dataHoraUltimaAtualizacao ? new Date(src.dataHoraUltimaAtualizacao).toLocaleDateString() : ' **/**/***** ';
      //const dataUltimaAtualRaw = src.dataHoraUltimaAtualizacao;
      const dataUltimaAtual = parseData(src.dataHoraUltimaAtualizacao);
      const classe = src.classe.codigo + ' - ' + src.classe.nome;
      const sistema = src.sistema.codigo + ' - ' + src.sistema.nome;
      const formato = src.formato.codigo + ' - ' + src.formato.nome;
      const orgaoJulgador = src.orgaoJulgador.codigo + ' - ' + src.orgaoJulgador.nome;
      const pri = src.movimentos[0]
      const primeiroMovimentoFormatado = pri? pri.codigo + ' - ' + pri.nome + ' em: ' + parseData(pri.dataHora) : '***';
      const ult = src.movimentos[src.movimentos.length -1]
      const ultimoMovimentoFormatado = ult? ult.codigo + ' - ' + ult.nome + ' em: ' + parseData(ult.dataHora): '***';
      const vm = src.movimentos;
      //const tr_julg = julg ? (`<p>✅ <strong>Trânsito em Julgado:</strong>`+ julg +`</p>`): ``;
      const julg = vm.filter(a => a.nome.toLowerCase().includes('julgado'))
      .map(a => `<span class="invisible-code" tabindex="0" title="${a.codigo}">${a.codigo}</span> - ${a.nome} em: ${parseData(a.dataHora)}`);

      const tr_julg = julg.length ? (`
        <div class="info-highlight">
          <span class="info-icon">✅</span>
          <div class="info-content">
            <strong>${julg.join('<br>')}</strong>
          </div>
          </div>
      `) : ``;

      container.innerHTML = `
        <div class="result-card fade-in">
          <button class="clear-btn" onclick="document.getElementById('result-container').innerHTML = ''; document.getElementById('processo').value = '';">🧹 Limpar</button>
          <h3>🆔 ${src.numeroProcesso}</h3>
          <p>🏛️ <strong>Tribunal:</strong> ${src.tribunal}</p>
          <p>📍 <strong>Grau:</strong> ${src.grau}</p>
          <p>📅 <strong>Data de Ajuizamento:</strong> ${dataAjuizamento}</p>
          <p>🕒 <strong>Última Atualização:</strong> ${dataUltimaAtual}</p>
          <p>🔒 <strong>Nível de Sigilo:</strong> ${src.nivelSigilo}</p>
          <p>📢 <strong>Assuntos:</strong> ${assuntosFormatados}</p>
          <p>📓 <strong>Classe:</strong> ${classe}</p>
          <p>🖥️ <strong>Sistema:</strong> ${sistema}</p>
          <p>🖺  <strong>Formato:</strong> ${formato}</p>
          <p>🧑‍⚖️ <strong>Orgão Julgador:</strong> ${orgaoJulgador}</p>
          <p>📚 <strong>Primeiro Movimento:</strong> ${primeiroMovimentoFormatado}</p>
          <p>🔥 <strong>Último Movimento:</strong> ${ultimoMovimentoFormatado}</p>
          ${tr_julg}
        </div>
      `;
    } catch (err) {
      container.innerHTML = `<p class="error">❌ Erro: ${err.message}</p>`;
    }
  };
}
