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
const signupError = $("#cadastro-erro");
function showSignupError(message, field) {
  signupError.textContent = message;
  signupError.classList.remove("hidden");
  if (field) field.focus();
}
function clearSignupError() {
  signupError.textContent = "";
  signupError.classList.add("hidden");
}
$("#signup-form").addEventListener("submit", async event => {
  event.preventDefault();
  clearSignupError();

  const nome = $("#full-name");
  const cpf = $("#cpf");
  const email = $("#signup-email");
  const celular = $("#phone");
  const cep = $("#cep");
  const senha = $("#signup-password");
  const confirmarSenha = $("#confirm-password");

  const regras = [
    { campo: nome, regex: /.+/, mensagem: "Informe seu nome completo (nome e sobrenome)." },
    { campo: cpf, regex: /^(?:\d{11}|\d{3}\.\d{3}\.\d{3}-\d{2})$/, mensagem: "Informe um CPF válido com 11 dígitos." },
    { campo: email, regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, mensagem: "Informe um e-mail válido." },
    { campo: celular, regex: /^(?:\(\d{2}\)|\d{2})\s?\d{5}-?\d{4}$/, mensagem: "Informe um celular com DDD e 9 dígitos." },
    { campo: cep, regex: /^\d{5}-?\d{3}$/, mensagem: "Informe um CEP com 8 dígitos." },
    { campo: senha, regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, mensagem: "A senha deve ter 8 caracteres, letra maiúscula, minúscula e número." }
  ];

  const partesNome = nome.value.trim().split(/\\s+/).filter(parte => /[\\p{L}]/u.test(parte));
  if (partesNome.length < 2) {
    showSignupError("Informe seu nome completo (nome e sobrenome).", nome);
    return;
  }

  for (const regra of regras) {
    if (!regra.regex.test(regra.campo.value.trim())) {
      showSignupError(regra.mensagem, regra.campo);
      return;
    }
  }

  if (cpf.value.replace(/\D/g, "").length !== 11) {
    showSignupError("O CPF precisa ter 11 dígitos.", cpf);
    return;
  }
  if (celular.value.replace(/\D/g, "").length !== 11) {
    showSignupError("O celular precisa ter 11 dígitos incluindo o DDD.", celular);
    return;
  }
  if (senha.value !== confirmarSenha.value) {
    showSignupError("As senhas não são iguais.", confirmarSenha);
    return;
  }

  const birthValue = $("#birth").value;
  const birth = new Date(`${birthValue}T00:00:00`);
  if (!birthValue || !Number.isFinite(birth.getTime()) || birth > new Date()) {
    showSignupError("Confira a data de nascimento informada.", $("#birth"));
    return;
  }

  const dados = {
    nome: nome.value.trim(),
    cpf: cpf.value.replace(/\D/g, ""),
    email: email.value.trim(),
    celular: celular.value.replace(/\D/g, ""),
    cep: cep.value.replace(/\D/g, ""),
    senha: senha.value,
    dataNascimento: birthValue,
    endereco: $("#address").value.trim(),
    rendaMensal: $("#income").value,
    tipoConta: $("#account-type").value
  };

  const botao = signupForm.querySelector('button[type="submit"]');
  botao.disabled = true;
  botao.textContent = "Enviando cadastro...";

  try {
    const resposta = await fetch("https://senac-bank-api.dennislopes.com.br/api/clientes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    });

    const resultado = await resposta.json().catch(() => ({}));
    if (!resposta.ok) {
      throw new Error(resultado.mensagem || resultado.message || "Não foi possível enviar o cadastro. Confira os dados.");
    }

    const protocolo = resultado.protocolo || resultado.id || ("BS-" + Math.floor(100000 + Math.random() * 900000));
    $("#protocol").textContent = protocolo;
    try { localStorage.removeItem(DRAFT_KEY); } catch (error) {}
    showView("analysis");
  } catch (error) {
    showSignupError(error.message || "Erro de conexão. Tente novamente.");
  } finally {
    botao.disabled = false;
    botao.innerHTML = 'Enviar cadastro <span>→</span>';
  }
});
$("#check-status").addEventListener("click", () => toast("Cadastro enviado para análise. Consulte o protocolo informado."));
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

// Persistência do rascunho do formulário de cadastro.
const DRAFT_KEY = "rascunhoCadastro";
const signupForm = document.getElementById("signup-form");
const clearDraftLink = document.getElementById("link-limpar-rascunho");

function saveSignupDraft() {
  if (!signupForm) return;
  const draft = {};
  signupForm.querySelectorAll("input, select, textarea").forEach(field => {
    if (!field.id) return;
    draft[field.id] = (field.type === "checkbox" || field.type === "radio")
      ? field.checked : field.value;
  });
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch (error) {
    console.warn("Não foi possível salvar o rascunho.", error);
  }
}

function restoreSignupDraft() {
  if (!signupForm) return;
  try {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (!saved) return;
    const draft = JSON.parse(saved);
    Object.entries(draft).forEach(([id, value]) => {
      const field = document.getElementById(id);
      if (!field || !signupForm.contains(field)) return;
      if (field.type === "checkbox" || field.type === "radio") {
        field.checked = Boolean(value);
      } else {
        field.value = value ?? "";
      }
    });
  } catch (error) {
    console.warn("Não foi possível restaurar o rascunho.", error);
  }
}

if (signupForm) {
  signupForm.addEventListener("input", saveSignupDraft);
  signupForm.addEventListener("change", saveSignupDraft);
  restoreSignupDraft();
}

if (clearDraftLink) {
  clearDraftLink.addEventListener("click", event => {
    event.preventDefault();
    localStorage.removeItem(DRAFT_KEY);
    if (signupForm) signupForm.reset();
    toast("Rascunho apagado. Os campos do cadastro foram limpos.");
  });
}
