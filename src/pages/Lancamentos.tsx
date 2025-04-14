import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Lancamentos.css';

interface Lancamento {
  id: number;
  descricao: string;
  data: string;
  hora: string;
  valor: number;
  tipo: 'pago' | 'recebido';
}

interface LancamentoEmEdicao {
  id: number;
  descricao: string;
  data: string;
  hora: string;
  valor: number;
  tipo: 'pago' | 'recebido';
}

interface NovoLancamento {
  descricao: string;
  data: string;
  hora: string;
  valor: string;
  tipo: 'pago' | 'recebido';
}

export function Lancamentos() {
  const navigate = useNavigate();
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([
    {
      id: 1,
      descricao: 'Compra de material de escritório',
      data: '2024-12-08',
      hora: '14:00',
      valor: 200.00,
      tipo: 'pago' as const
    },
    {
      id: 2,
      descricao: 'Recebimento de cliente',
      data: '2024-12-08',
      hora: '12:23',
      valor: 1500.00,
      tipo: 'recebido' as const
    },
    {
      id: 3,
      descricao: 'Pagamento de serviços',
      data: '2024-05-07',
      hora: '10:30',
      valor: 750.00,
      tipo: 'pago' as const
    },
    {
      id: 4,
      descricao: 'Recebimento de cliente',
      data: '2024-05-07',
      hora: '09:45',
      valor: 650.00,
      tipo: 'recebido' as const
    },
    {
      id: 5,
      descricao: 'Pagamento de impostos',
      data: '2024-05-06',
      hora: '15:27',
      valor: 1345.23,
      tipo: 'pago' as const
    },
    {
      id: 6,
      descricao: 'Pagamento de emolumentos',
      data: '2024-05-06',
      hora: '12:30',
      valor: 850.00,
      tipo: 'pago' as const
    }
  ].sort((a, b) => a.id - b.id));

  const [editando, setEditando] = useState<LancamentoEmEdicao | null>(null);
  const [showNovoLancamento, setShowNovoLancamento] = useState(false);
  const [novoLancamento, setNovoLancamento] = useState<NovoLancamento>({
    descricao: '',
    data: '',
    hora: '',
    valor: '',
    tipo: 'pago'
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [lancamentoParaDeletar, setLancamentoParaDeletar] = useState<number | null>(null);

  const totalPago = lancamentos
    .filter(l => l.tipo === 'pago')
    .reduce((acc, l) => acc + l.valor, 0);

  const totalRecebido = lancamentos
    .filter(l => l.tipo === 'recebido')
    .reduce((acc, l) => acc + l.valor, 0);

  const saldo = totalRecebido - totalPago;

  const handleDelete = (id: number) => {
    setLancamentoParaDeletar(id);
    setShowDeleteModal(true);
  };

  const confirmarDelete = () => {
    if (lancamentoParaDeletar) {
      setLancamentos(lancamentos.filter(l => l.id !== lancamentoParaDeletar));
    }
    setShowDeleteModal(false);
    setLancamentoParaDeletar(null);
  };

  const cancelarDelete = () => {
    setShowDeleteModal(false);
    setLancamentoParaDeletar(null);
  };

  const handleEdit = (lancamento: Lancamento) => {
    setEditando({
      id: lancamento.id,
      descricao: lancamento.descricao,
      data: lancamento.data,
      hora: lancamento.hora,
      valor: lancamento.valor,
      tipo: lancamento.tipo
    });
  };

  const handleSaveEdit = () => {
    if (editando) {
      const novoValor = Number(editando.valor);

      if (isNaN(novoValor)) {
        alert('Por favor, insira um valor válido.');
        return;
      }

      if (!editando.descricao || !editando.data || !editando.hora) {
        alert('Por favor, preencha todos os campos.');
        return;
      }

      setLancamentos(prevLancamentos => 
        prevLancamentos.map(lancamento => 
          lancamento.id === editando.id 
            ? {
                ...lancamento,
                descricao: editando.descricao,
                data: editando.data,
                hora: editando.hora,
                valor: novoValor,
                tipo: editando.tipo
              }
            : lancamento
        )
      );
      
      setEditando(null);
    }
  };

  const handleCancelEdit = () => {
    setEditando(null);
  };

  const handleNovoLancamento = () => {
    setShowNovoLancamento(true);
  };

  const formatarData = (data: string) => {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  const handleSaveNovoLancamento = () => {
    const novoValor = parseFloat(novoLancamento.valor.replace(',', '.'));

    if (!novoLancamento.descricao || !novoLancamento.data || !novoLancamento.hora || isNaN(novoValor)) {
      alert('Por favor, preencha todos os campos corretamente.');
      return;
    }

    const proximoId = lancamentos.length > 0 
      ? Math.max(...lancamentos.map(l => l.id)) + 1 
      : 1;

    const lancamento: Lancamento = {
      id: proximoId,
      descricao: novoLancamento.descricao,
      data: novoLancamento.data,
      hora: novoLancamento.hora,
      valor: novoValor,
      tipo: novoLancamento.tipo
    };

    setLancamentos(prevLancamentos => [...prevLancamentos, lancamento].sort((a, b) => a.id - b.id));
    setShowNovoLancamento(false);
    setNovoLancamento({
      descricao: '',
      data: '',
      hora: '',
      valor: '',
      tipo: 'pago'
    });
  };

  const handleCancelNovoLancamento = () => {
    setShowNovoLancamento(false);
    setNovoLancamento({
      descricao: '',
      data: '',
      hora: '',
      valor: '',
      tipo: 'pago'
    });
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <div className="lancamentos-container">
      <div className="header">
        <span className="logo" onClick={handleLogoClick}>Logo</span>
        <h1>Livro Caixa</h1>
      </div>
      
      {showNovoLancamento && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Novo lançamento</h3>
            <div className="form-group">
              <label>Descrição</label>
              <input
                type="text"
                placeholder="Descrição"
                value={novoLancamento.descricao}
                onChange={e => setNovoLancamento({...novoLancamento, descricao: e.target.value})}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Data</label>
                <input
                  type="date"
                  placeholder="dd/mm/aaaa"
                  value={novoLancamento.data}
                  onChange={e => setNovoLancamento({...novoLancamento, data: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Hora</label>
                <input
                  type="time"
                  placeholder="HH:MM"
                  value={novoLancamento.hora}
                  onChange={e => setNovoLancamento({...novoLancamento, hora: e.target.value})}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Valor</label>
              <input
                type="text"
                placeholder="R$"
                value={novoLancamento.valor}
                onChange={e => setNovoLancamento({...novoLancamento, valor: e.target.value})}
              />
            </div>

            <div className="form-group tipo-group">
              <div>
                <input
                  type="radio"
                  id="pago"
                  name="tipo"
                  checked={novoLancamento.tipo === 'pago'}
                  onChange={() => setNovoLancamento({...novoLancamento, tipo: 'pago'})}
                />
                <label htmlFor="pago">Pago</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="recebido"
                  name="tipo"
                  checked={novoLancamento.tipo === 'recebido'}
                  onChange={() => setNovoLancamento({...novoLancamento, tipo: 'recebido'})}
                />
                <label htmlFor="recebido">Recebido</label>
              </div>
            </div>

            <div className="modal-actions">
              <button onClick={handleSaveNovoLancamento} className="btn-salvar">
                Salvar
              </button>
              <button onClick={handleCancelNovoLancamento} className="btn-cancelar">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Excluir</h3>
            <p>Você têm certeza de excluir este registro ?</p>
            <div className="modal-actions">
              <button onClick={confirmarDelete} className="btn-salvar">
                Sim
              </button>
              <button onClick={cancelarDelete} className="btn-cancelar">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {editando && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Editar</h3>
            <div className="form-group">
              <label>Descrição</label>
              <input
                type="text"
                value={editando.descricao}
                onChange={e => setEditando({...editando, descricao: e.target.value})}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Data</label>
                <input
                  type="date"
                  value={editando.data}
                  onChange={e => setEditando({...editando, data: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Hora</label>
                <input
                  type="time"
                  value={editando.hora}
                  onChange={e => setEditando({...editando, hora: e.target.value})}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Valor</label>
              <input
                type="number"
                step="0.01"
                value={editando.valor}
                onChange={e => setEditando({...editando, valor: Number(e.target.value)})}
              />
            </div>

            <div className="form-group tipo-group">
              <div>
                <input
                  type="radio"
                  id="edit-pago"
                  name="edit-tipo"
                  checked={editando.tipo === 'pago'}
                  onChange={() => setEditando({...editando, tipo: 'pago'})}
                />
                <label htmlFor="edit-pago">Pago</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="edit-recebido"
                  name="edit-tipo"
                  checked={editando.tipo === 'recebido'}
                  onChange={() => setEditando({...editando, tipo: 'recebido'})}
                />
                <label htmlFor="edit-recebido">Recebido</label>
              </div>
            </div>

            <div className="modal-actions">
              <button onClick={handleSaveEdit} className="btn-salvar">
                Salvar
              </button>
              <button onClick={handleCancelEdit} className="btn-cancelar">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="tabela-container">
        <table className="tabela-lancamentos">
          <thead>
            <tr>
              <th>ID</th>
              <th>Descrição</th>
              <th>Data</th>
              <th>Hora</th>
              <th>Valor (R$)</th>
              <th>Tipo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {lancamentos.map(lancamento => (
              <tr key={lancamento.id}>
                <td>{lancamento.id}</td>
                <td>{lancamento.descricao}</td>
                <td>{formatarData(lancamento.data)}</td>
                <td>{lancamento.hora}</td>
                <td>{lancamento.valor.toFixed(2)}</td>
                <td>{lancamento.tipo === 'pago' ? 'Pago' : 'Recebido'}</td>
                <td>
                  <button 
                    onClick={() => handleEdit(lancamento)}
                    className="acao-btn editar"
                  >
                    Editar
                  </button>
                  {' | '}
                  <button 
                    onClick={() => handleDelete(lancamento.id)}
                    className="acao-btn deletar"
                  >
                    Deletar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="resumo-container">
        <div className="totais">
          <div className="total-box">
            <span>Total de pagos</span>
            <div className="valor-box">
              {totalPago.toFixed(2)}
            </div>
          </div>
          
          <div className="total-box">
            <span>Total de recebidos</span>
            <div className="valor-box">
              {totalRecebido.toFixed(2)}
            </div>
          </div>
          
          <div className="total-box">
            <span>Saldo</span>
            <div className="valor-box">
              {saldo.toFixed(2)}
            </div>
          </div>
        </div>

        <button className="novo-lancamento-btn" onClick={handleNovoLancamento}>
          Novo lançamento
        </button>
      </div>
    </div>
  );
} 