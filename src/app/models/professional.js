const mongoose = require('../../database');
const bcrypt = require('bcryptjs');

var Schema = mongoose.Schema;

const ProfessionalSchema = new mongoose.Schema({
  nome: {type: String, required: false},
	email: {type: String, required: false},
	dataNascimento: {type: String, required: false},
	rg: {type: String, required: false},
	cpf: {type: String, required: false},
	possuiHabilitacao: {type: String, required: false},
	habilitacaoVeiculo: {type: String, required: false},
	especialidade: {type: String, required: false},
	certificacao: {type: String, required: false},
	experienciaCuidadorIdosos: {type: String, required: false},
	trabalhaAtualmente: {type: String, required: false},
	sobre: {type: String, required: false},
	esperaPlataforma: {type: String, required: false},
	comoConheceu: {type: String, required: false},
	curriculoAnexo: {type: String, required: false},
	certificadoAnexo: {type: String, required: false},
	cartaRecomendacaoAnexo: {type: String, required: false},
	endereco: {type: String, required: false},
	bairro: {type: String, required: false},
	cidade: {type: String, required: false},
	estado: {type: String, required: false},
	pais: {type: String, required: false},
	foto: {type: String, required: false},
	update_at: {type: Date, required: false},
	createdAt: {type: Date, required: false},
	email: {type: String, required: false},
	user: { type: Schema.Types.ObjectId, ref: "User", required: true }
});

const Professional = mongoose.model('Professional', ProfessionalSchema);

module.exports = Professional;
