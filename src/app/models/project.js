const mongoose = require('../../database');
const bcrypt = require('bcryptjs');

var Schema = mongoose.Schema;

const ProjectSchema = new mongoose.Schema({
  nome: {type: String, required: true},
	email: {type: String, required: true},
	dataNascimento: {type: String, required: true},
	rg: {type: String, required: true},
	cpf: {type: String, required: true},
	possuiHabilitacao: {type: String, required: true},
	habilitacaoVeiculo: {type: String, required: true},
	especialidade: {type: String, required: true},
	certificacao: {type: String, required: true},
	experienciaCuidadorIdosos: {type: String, required: true},
	trabalhaAtualmente: {type: String, required: true},
	sobre: {type: String, required: true},
	esperaPlataforma: {type: String, required: true},
	comoConheceu: {type: String, required: true},
	curriculoAnexo: {type: String, required: true},
	certificadoAnexo: {type: String, required: true},
	cartaRecomendacaoAnexo: {type: String, required: true},
	endereco: {type: String, required: true},
	bairro: {type: String, required: true},
	cidade: {type: String, required: true},
	estado: {type: String, required: true},
	pais: {type: String, required: true},
	foto: {type: String, required: true},
	update_at: {type: Date, required: false},
	createdAt: {type: Date, required: false},
	email: {type: String, required: true},
	user: { type: Schema.Types.ObjectId, ref: "User", required: true }
});

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;
