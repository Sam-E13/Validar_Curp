/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express');
const router = express.Router();

// Validación mejorada de CURP
function isValidCurp(curp) {
    if (!curp || typeof curp !== 'string') {
        return { valid: false };
    }

    const regex = /^([A-Z][AEIOU][A-Z]{2})(\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01]))([HM])(AS|BC|BS|CC|CL|CM|CS|CH|DF|DG|GR|GT|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d]\d$/;
    const match = curp.toUpperCase().match(regex);

    if (!match) {
        return { valid: false };
    }

    try {
        const year = parseInt(match[2].substring(0, 2)) + 1900;
        const month = parseInt(match[2].substring(2, 4)) - 1;
        const day = parseInt(match[2].substring(4, 6));
        
        const birthDate = new Date(year, month, day);
        if (isNaN(birthDate.getTime())) {
            return { valid: false };
        }

        return {
            valid: true,
            firstNameLetter: match[1].charAt(0),
            lastName1Letter: match[1].charAt(1),
            lastName2Letter: match[1].charAt(2),
            sex: match[4] === 'H' ? 'Hombre' : 'Mujer',
            birthDate: birthDate.toISOString().split('T')[0], // Formato YYYY-MM-DD
            state: match[5] // Estado de registro
        };
    } catch (error) {
        return { valid: false };
    }
}

// Ruta de validación
router.post('/validate', (req, res) => {
    try {
        const { curp } = req.body;
        
        if (!curp) {
            return res.status(400).json({ error: 'Se requiere el parámetro CURP' });
        }

        const result = isValidCurp(curp);
        res.status(result.valid ? 200 : 400).json(result);
        
    } catch (error) {
        console.error('Error validando CURP:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;