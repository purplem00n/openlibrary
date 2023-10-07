import {
    parseIsbn,
    parseLccn,
    isChecksumValidIsbn10,
    isChecksumValidIsbn13,
    isFormatValidIsbn10,
    isFormatValidIsbn13,
    isValidLccn
} from './idValidation.js'

let invalidChecksum;
let invalidIsbn10;
let invalidIsbn13;
let invalidLccn;

export function initAddBookImport () {
    $('.list-books a').on('click', function() {
        var li = $(this).parents('li').first();
        $('input#work').val(`/works/${li.attr('id')}`);
        $('form#addbook').trigger('submit');
    });
    $('#bookAddCont').on('click', function() {
        $('input#work').val('none-of-these');
        $('form#addbook').trigger('submit');
    });

    const i18nStrings = JSON.parse(document.querySelector('#id-errors').dataset.i18n)
    invalidChecksum = i18nStrings.invalid_checksum;
    invalidIsbn10 = i18nStrings.invalid_isbn10;
    invalidIsbn13 = i18nStrings.invalid_isbn13;
    invalidLccn = i18nStrings.invalid_lccn;

    $('#addbook').on('submit', parseAndValidateId);
    $('#id_value').on('input', clearErrors);
    $('#id_name').on('change', clearErrors);
}

// a flag to make raiseIsbnError perform differently upon subsequent calls
let addBookWithIsbnErrors = false;

function displayIsbnError(event, errorMessage) {
    if (!addBookWithIsbnErrors) {
        addBookWithIsbnErrors = true;
        const errorDiv = document.getElementById('id-errors');
        errorDiv.classList.remove('hidden');
        errorDiv.textContent = errorMessage;
        const confirm = document.getElementById('confirm-add');
        confirm.classList.remove('hidden');
        const isbnInput = document.getElementById('id_value');
        isbnInput.focus({focusVisible: true});
        event.preventDefault();
        return;
    }
    // parsing potentially invalid ISBN
    document.getElementById('id_value').value = parseIsbn(document.getElementById('id_value').value);
}

function displayLccnError(event, errorMessage) {
    const errorDiv = document.getElementById('id-errors');
    errorDiv.classList.remove('hidden');
    errorDiv.textContent = errorMessage;
    event.preventDefault();
    return;
}

function clearErrors() {
    addBookWithIsbnErrors = false;
    const errorDiv = document.getElementById('id-errors');
    errorDiv.classList.add('hidden');
    const confirm = document.getElementById('confirm-add');
    confirm.classList.add('hidden');
}

function parseAndValidateId(event) {
    const fieldName = document.getElementById('id_name').value;
    const idValue = document.getElementById('id_value').value;

    if (fieldName === 'isbn_10') {
        parseAndValidateIsbn10(event, idValue);
    }
    else if (fieldName === 'isbn_13') {
        parseAndValidateIsbn13(event, idValue);
    }
    else if (fieldName === 'lccn') {
        parseAndValidateLccn(event, idValue);
    }
}

function parseAndValidateIsbn10(event, idValue) {
    // parsing valid ISBN that passes checks
    idValue = parseIsbn(idValue);
    if (!isFormatValidIsbn10(idValue)) {
        return displayIsbnError(event, invalidIsbn10);
    }
    if (!isChecksumValidIsbn10(idValue)) {
        return displayIsbnError(event, invalidChecksum);
    }
    document.getElementById('id_value').value = idValue;
}

function parseAndValidateIsbn13(event, idValue) {
    idValue = parseIsbn(idValue);
    if (!isFormatValidIsbn13(idValue)) {
        return displayIsbnError(event, invalidIsbn13);
    }
    if (!isChecksumValidIsbn13(idValue)) {
        return displayIsbnError(event, invalidChecksum);
    }
    document.getElementById('id_value').value = idValue;
}

function parseAndValidateLccn(event, idValue) {
    idValue = parseLccn(idValue);
    if (!isValidLccn(idValue)) {
        return displayLccnError(event, invalidLccn);
    }
    document.getElementById('id_value').value = idValue;
}
