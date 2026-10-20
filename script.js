const $ = (selector) => document.querySelector(selector);
const views = ["login", "signup", "analysis", "dashboard"];
const panelTitles = {
  login: ["BEM-VINDO DE VOLTA", "Acesse sua conta", "Entre para continuar sua experiência no Banco Senac."],
  signup: ["COMECE POR AQUI", "Abra sua conta", "Preencha os dados para simular a abertura de uma conta."],
  analysis: ["SOLICITAÇÃO ENVIADA", "Análise de cadastro", "Acompanhe o andamento da sua solicitação demonstrativa."],
  dashboard: ["ÁREA DO CLIENTE", "Resumo da conta", "Confira as informações da sua conta simulada."]
};
function showView(name) {
  views.forEach(v => $(`#${v}-view`).classList.toggle("hidden", v !== name));
  $("#panel-kicker").textContent = panelTitles[name][0];
  $("#panel-title").textContent = panelTitles[name][1];
  $("#panel-description").textContent = panelTitles[name][2];
  $("#toast").classList.add("hidden");
}
function toast(message) {
  const el = $("#toast");
  el.textContent = message;
  el.classList.remove("hidden");
}
$("#open-account-button").addEventListener("click", () => showView("signup"));
document.querySelectorAll("[data-go]").forEach(button => button.addEventListener("click", () => showView(button.dataset.go)));
document.querySelectorAll("[data-toggle]").forEach(button => button.addEventListener("click", () => {
  const input = document.getElementById(button.dataset.toggle);
  input.type = input.type === "password" ? "text" : "password";
}));
$("#forgot-button").addEventListener("click", () => toast("Recuperação de senha indisponível nesta demonstração acadêmica."));
$("#login-form").addEventListener("submit", event => {
  event.preventDefault();
  const email = $("#login-email").value.trim();
  const name = email.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, c => c.toUpperCase()) || "Cliente";
  $("#customer-name").textContent = name;
  showView("dashboard");
});
$("#cpf").addEventListener("input", event => {
  let value = event.target.value.replace(/\D/g, "").slice(0, 11);
  value = value.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  event.target.value = value;
});
$("#phone").addEventListener("input", event => {
  let value = event.target.value.replace(/\D/g, "").slice(0, 11);
  if (value.length > 10) value = value.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, "($1) $2-$3");
  else if (value.length > 6) value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
  else if (value.length > 2) value = value.replace(/^(\d{2})(\d+)/, "($1) $2");
  event.target.value = value;
});
$("#cep").addEventListener("input", event => {
  let value = event.target.value.replace(/\D/g, "").slice(0, 8);
  if (value.length > 5) value = value.replace(/^(\d{5})(\d+)/, "$1-$2");
  event.target.value = value;
});
$("#signup-form").addEventListener("submit", event => {
  event.preventDefault();
  const birth = new Date(`${$("#birth").value}T00:00:00`);
  const today = new Date();
  if (!Number.isFinite(birth.getTime()) || birth > today) {
    toast("Confira a data de nascimento informada.");
    return;
  }
  if ($("#cpf").value.replace(/\D/g, "").length !== 11) {
    toast("Para a simulação, informe um CPF com 11 dígitos.");
    return;
  }
  const protocol = "BS-" + Math.floor(100000 + Math.random() * 900000);
  $("#protocol").textContent = protocol;
  showView("analysis");
});
$("#check-status").addEventListener("click", () => toast("Status atual: em análise. Este protótipo não envia dados para um servidor."));
let balanceVisible = true;
$("#toggle-balance").addEventListener("click", () => {
  balanceVisible = !balanceVisible;
  $("#balance").textContent = balanceVisible ? "R$ 2.450,80" : "••••••••";
});
document.querySelectorAll("[data-action]").forEach(button => button.addEventListener("click", () => {
  toast(`${button.dataset.action}: recurso ilustrativo, sem transações reais.`);
}));
$("#logout-button").addEventListener("click", () => {
  $("#login-form").reset();
  showView("login");
});
