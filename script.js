"use strict";

const $ = (selector) => document.querySelector(selector);
const signupForm = $("#signup-form");
const signupError = $("#cadastro-erro");
const signupButton = $("#signup-submit");

const views = ["login", "signup", "analysis", "dashboard"];
const panelTitles = {
  login: ["BEM-VINDO DE VOLTA", "Acesse sua conta", "Entre para continuar sua experiência no Banco Senac."],
  signup: ["COMECE POR AQUI", "Abra sua conta", "Preencha os dados para simular a abertura de uma conta."],
  analysis: ["SOLICITAÇÃO ENVIADA", "Análise de cadastro", "Acompanhe o andamento da sua solicitação demonstrativa."],
  dashboard: ["ÁREA DO CLIENTE", "Resumo da conta", "Confira as informações da sua conta simulada."]
};

function showView(name) {
  views.forEach((view) => {
    $(`#${view}-view`).classList.toggle("hidden", view !== name);
  });
  $("#panel-kicker").textContent = panelTitles[name][0];
  $("#panel-title").textContent = panelTitles[name][1];
  $("#panel-description").textContent = panelTitles[name][2];
  $("#toast").classList.add("hidden");
}

function toast(message) {
  const element = $("#toast");
  element.textContent = message;
  element.classList.remove("hidden");
}

function showSignupError(message, field) {
  signupError.textContent = message;
  signupError.classList.remove("hidden");
  if (field) {
    field.focus();
    field.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

function clearSignupError() {
  signupError.textContent = "";
  signupError.classList.add("hidden");
}

function onlyDigits(value) {
  return value.replace(/\D/g, "");
}

function isValidCPF(value) {
  const cpf = onlyDigits(value);
  if (!/^\d{11}$/.test(cpf) || /^(\d)\1{10}$/.test(cpf)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i += 1) sum += Number(cpf[i]) * (10 - i);
  let digit = (sum * 10) % 11;
  if (digit === 10) digit = 0;
  if (digit !== Number(cpf[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i += 1) sum += Number(cpf[i]) * (11 - i);
  digit = (sum * 10) % 11;
  if (digit === 10) digit = 0;
  return digit === Number(cpf[10]);
}

function isValidFullName(value) {
  const parts = value.trim().replace(/\s+/gu, " ").split(" ");
  if (parts.length < 2) return false;
  const namePart = /^[\p{L}]+(?:['’-][\p{L}]+)*$/u;
  return parts.every((part) => namePart.test(part));
}

function isValidBirthDate(value) {
  if (!value) return false;
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return false;
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return date <= today;
}

// Navegação entre as telas
$("#open-account-button").addEventListener("click", () => showView("signup"));
document.querySelectorAll("[data-go]").forEach((button) => {
  button.addEventListener("click", () => showView(button.dataset.go));
});

document.querySelectorAll("[data-toggle]").forEach((button) => {
  button.addEventListener("click", () => {
    const input = document.getElementById(button.dataset.toggle);
    input.type = input.type === "password" ? "text" : "password";
  });
});

$("#forgot-button").addEventListener("click", () => {
  toast("Recuperação de senha indisponível nesta demonstração acadêmica.");
});

// Login demonstrativo
$("#login-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const email = $("#login-email").value.trim();
  const name = email.split("@")[0]
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
  $("#customer-name").textContent = name || "Cliente";
  showView("dashboard");
});

// Máscaras de entrada
$("#cpf").addEventListener("input", (event) => {
  let value = onlyDigits(event.target.value).slice(0, 11);
  value = value
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  event.target.value = value;
});

$("#phone").addEventListener("input", (event) => {
  let value = onlyDigits(event.target.value).slice(0, 11);
  if (value.length > 10) {
    value = value.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, "($1) $2-$3");
  } else if (value.length > 6) {
    value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
  } else if (value.length > 2) {
    value = value.replace(/^(\d{2})(\d+)/, "($1) $2");
  } else if (value.length > 0) {
    value = `(${value}`;
  }
  event.target.value = value;
});

$("#cep").addEventListener("input", (event) => {
  let value = onlyDigits(event.target.value).slice(0, 8);
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

document.querySelectorAll("[data-action]").forEach((button) => {
  button.addEventListener("click", () => {
    toast(`${button.dataset.action}: recurso ilustrativo, sem transações reais.`);
  });
});

$("#logout-button").addEventListener("click", () => {
  $("#login-form").reset();
  showView("login");
});
