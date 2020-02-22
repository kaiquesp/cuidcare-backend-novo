const mongoose = require('../../database');
const bcrypt = require('bcryptjs');

var Schema = mongoose.Schema;

const ClientSchema = new mongoose.Schema({
	nome: { type: String, required: false },
	cpf: { type: String, required: false },
	dataNascimento: { type: String, required: false },
	rg: { type: String, required: false },
	endereco: { type: String, required: false },
	telefone: { type: String, required: false },
	foto: { type: String, required: false },
	user: { type: Schema.Types.ObjectId, ref: "User", required: true }
});

const Client = mongoose.model('Client', ClientSchema);

module.exports = Client;
