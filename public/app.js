$(function() {
  const apiUrl = 'http://localhost:3000/api';

  function showSection(sectionId) {
    $('.section').addClass('d-none');
    $('#' + sectionId).removeClass('d-none');
    $('#menuTabs button').removeClass('active');
    sectionId === 'clientes' ? $('#btnClientes').addClass('active') : $('#btnRemedios').addClass('active');
  }

  function showMessage(message, type) {
    const alertHtml = `<div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button>
    </div>`;
    $('#feedbackMessage').html(alertHtml);
  }

  $('#btnClientes').on('click', function() {
    showSection('clientes');
  });

  $('#btnRemedios').on('click', function() {
    showSection('remedios');
  });

  $('#clienteForm').on('submit', function(e) {
    e.preventDefault();
    const cliente = {
      nome: $('#clienteNome').val(),
      email: $('#clienteEmail').val(),
      telefone: $('#clienteTelefone').val()
    };

    $.ajax({
      url: `${apiUrl}/clientes`,
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(cliente),
      success: function(result) {
        showMessage(result.message, 'success');
        $('#clienteForm')[0].reset();
        loadClientes();
      },
      error: function(xhr) {
        const message = xhr.responseJSON?.message || 'Erro ao cadastrar cliente.';
        showMessage(message, 'danger');
      }
    });
  });

  $('#remedioForm').on('submit', function(e) {
    e.preventDefault();
    const remedio = {
      nome: $('#remedioNome').val(),
      fabricante: $('#remedioFabricante').val(),
      preco: $('#remedioPreco').val()
    };

    $.ajax({
      url: `${apiUrl}/remedios`,
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(remedio),
      success: function(result) {
        showMessage(result.message, 'success');
        $('#remedioForm')[0].reset();
        loadRemedios();
      },
      error: function(xhr) {
        const message = xhr.responseJSON?.message || 'Erro ao cadastrar remédio.';
        showMessage(message, 'danger');
      }
    });
  });

  function renderClientes(clientes) {
    if (!clientes.length) {
      return '<div class="alert alert-light">Nenhum cliente cadastrado ainda.</div>';
    }

    let html = '<div class="table-responsive"><table class="table table-sm table-striped align-middle">';
    html += '<thead><tr><th>ID</th><th>Nome</th><th>Email</th><th>Telefone</th></tr></thead><tbody>';
    clientes.forEach(cliente => {
      html += `<tr><td>${cliente.id}</td><td>${cliente.nome}</td><td>${cliente.email}</td><td>${cliente.telefone}</td></tr>`;
    });
    html += '</tbody></table></div>';
    return html;
  }

  function renderRemedios(remedios) {
    if (!remedios.length) {
      return '<div class="alert alert-light">Nenhum remédio cadastrado ainda.</div>';
    }

    let html = '<div class="table-responsive"><table class="table table-sm table-striped align-middle">';
    html += '<thead><tr><th>ID</th><th>Nome</th><th>Fabricante</th><th>Preço</th></tr></thead><tbody>';
    remedios.forEach(remedio => {
      html += `<tr><td>${remedio.id}</td><td>${remedio.nome}</td><td>${remedio.fabricante}</td><td>R$ ${remedio.preco}</td></tr>`;
    });
    html += '</tbody></table></div>';
    return html;
  }

  function loadClientes() {
    $.get(`${apiUrl}/clientes`, function(data) {
      $('#clientesContent').html(renderClientes(data.clientes));
    }).fail(function() {
      $('#clientesContent').html('<div class="alert alert-warning">Não foi possível carregar clientes.</div>');
    });
  }

  function loadRemedios() {
    $.get(`${apiUrl}/remedios`, function(data) {
      $('#remediosContent').html(renderRemedios(data.remedios));
    }).fail(function() {
      $('#remediosContent').html('<div class="alert alert-warning">Não foi possível carregar remédios.</div>');
    });
  }

  showSection('clientes');
  loadClientes();
  loadRemedios();
});