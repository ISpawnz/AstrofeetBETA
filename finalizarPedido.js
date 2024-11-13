
document.querySelector('.mais').addEventListener('click', function() {
    let quantidade = parseInt(document.getElementById('quantidade').value);
    document.getElementById('quantidade').value = quantidade + 1;
});

document.querySelector('.menos').addEventListener('click', function() {
    let quantidade = parseInt(document.getElementById('quantidade').value);
    if (quantidade > 1) {
        document.getElementById('quantidade').value = quantidade - 1;
    }
});
