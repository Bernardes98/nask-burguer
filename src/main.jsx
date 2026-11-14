import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const initialProducts = [
  { id: 1, name: 'QuarterNask 2 por 1', category: 'Promoções', price: 39.9, description: 'Dois burgers para dividir — a pedida que já chama atenção no cardápio.', image: '/images/burger-double.jpg', tag: '2 POR 1', active: true },
  { id: 2, name: 'Ragu', category: 'Hambúrgueres', price: 34.9, description: 'Carne suculenta, queijo derretido e nosso ragu preparado lentamente.', image: '/images/burger-ragu.jpg', tag: 'MAIS PEDIDO', active: true },
  { id: 3, name: 'Nask Cheddar', category: 'Hambúrgueres', price: 32.9, description: 'Pão australiano, carne 160g, cebola caramelizada e molho cheddar autoral.', image: '/images/burger-cheese.jpg', tag: '', active: true },
  { id: 4, name: 'Duplo da Nask', category: 'Hambúrgueres', price: 38.9, description: 'Dois smash burgers, queijo, picles e molho especial da casa.', image: '/images/burger-classic.jpg', tag: '', active: true },
  { id: 5, name: 'Batata Nask', category: 'Acompanhamentos', price: 15.9, description: 'Batata crocante, sequinha e temperada na medida.', image: '/images/burger-cheese.jpg', tag: 'CROCANTE', active: true },
  { id: 6, name: 'Combo Nask', category: 'Combos', price: 45.9, description: 'Um burger clássico, batata e bebida gelada para fechar o pedido.', image: '/images/burger-classic.jpg', tag: 'COMBO', active: true },
];
const extras = [{ name: 'Cheddar extra', price: 4 }, { name: 'Bacon crocante', price: 5 }, { name: 'Hambúrguer 160g', price: 9 }, { name: 'Cebola caramelizada', price: 3 }];
const demoOrders = [
  { id: 2041, client: 'Lucas M.', address: 'Rua Mostardeiro, 123 · Moinhos de Vento', total: 72.8, status: 'Em preparo', lat: 35, left: 31 },
  { id: 2040, client: 'Ana C.', address: 'Rua Felipe Camarão, 480 · Rio Branco', total: 54.7, status: 'Pronto', lat: 61, left: 62 },
  { id: 2039, client: 'Rafa P.', address: 'Av. Independência, 890 · Independência', total: 39.9, status: 'Em preparo', lat: 72, left: 36 },
];
const money = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

function App() {
  const [products, setProducts] = useState(() => {
    try { return JSON.parse(localStorage.getItem('nask-demo-products')) || initialProducts; }
    catch { return initialProducts; }
  });
  const [category, setCategory] = useState('Todos');
  const [selected, setSelected] = useState(null);
  const [extraNames, setExtraNames] = useState([]);
  const [removed, setRemoved] = useState([]);
  const [notes, setNotes] = useState('');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [success, setSuccess] = useState(false);
  const [view, setView] = useState('shop');
  const [adminTab, setAdminTab] = useState('Visão geral');
  const [orderType, setOrderType] = useState('Delivery');
  const [address, setAddress] = useState({ name: '', phone: '', street: '', number: '', neighborhood: '', complement: '' });
  const [payment, setPayment] = useState('Pix');
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState('');

  const cats = ['Todos', ...new Set(products.filter(p => p.active).map(p => p.category))];
  const visible = products.filter(p => p.active && (category === 'Todos' || p.category === category));
  const cartCount = cart.reduce((n, row) => n + row.qty, 0);
  const subtotal = cart.reduce((n, row) => n + row.qty * row.price, 0);
  const delivery = orderType === 'Delivery' && cart.length ? 5.9 : 0;
  const total = subtotal + delivery;

  useEffect(() => { localStorage.setItem('nask-demo-products', JSON.stringify(products)); }, [products]);

  function openProduct(product) { setSelected(product); setExtraNames([]); setRemoved([]); setNotes(''); }
  function addConfigured() {
    const additions = extras.filter(e => extraNames.includes(e.name));
    const price = selected.price + additions.reduce((n, e) => n + e.price, 0);
    setCart(c => [...c, { key: Date.now() + Math.random(), product: selected, price, qty: 1, additions: extraNames, removed, notes }]);
    setSelected(null); setToast('Adicionado à sacola'); setTimeout(() => setToast(''), 1800);
  }
  function changeQty(key, delta) { setCart(c => c.map(x => x.key === key ? { ...x, qty: x.qty + delta } : x).filter(x => x.qty > 0)); }
  function finishOrder(e) { e.preventDefault(); setSuccess(true); setCheckout(false); setShowCart(false); setCart([]); }
  function saveProduct(e) {
    e.preventDefault(); const f = new FormData(e.currentTarget);
    const item = { id: editing?.id || Date.now(), name: f.get('name'), category: f.get('category'), price: Number(f.get('price')), description: f.get('description'), image: editing?.image || '/images/burger-classic.jpg', tag: editing?.tag || '', active: true };
    setProducts(list => editing ? list.map(p => p.id === item.id ? item : p) : [...list, item]); setEditing(null); setToast('Produto salvo nesta demonstração'); setTimeout(() => setToast(''), 2400);
  }

  return <>
    <div className="demo-banner">DEMONSTRAÇÃO DE PORTFÓLIO <span>Pedidos, pagamentos e dados são fictícios</span></div>
    {view === 'shop' ? <>
      <header className="topbar"><div className="container nav">
        <a className="brand" href="#top"><img src="/images/nask-logo.jpg"/><span><b>nask burguer</b><small>HAMBURGUERIA · PORTO ALEGRE</small></span></a>
        <nav><a href="#cardapio">Cardápio</a><a href="#sobre">A Nask</a><a href="#contato">Contato</a><button className="link-btn" onClick={() => {setView('admin');setAdminTab('Visão geral')}}>Área da loja ↗</button></nav>
        <button className="cart-button" onClick={() => setShowCart(true)}>Sacola <span>{cartCount}</span></button>
      </div></header>
      <main id="top" className="container">
        <section id="cardapio" className="menu-section"><div className="section-head"><div><div className="eyebrow">Escolhe o teu favorito</div><h2>Cardápio <span>da casa</span></h2></div><p>Feito na hora, com ingredientes que fazem a diferença.</p></div>
          <div className="categories">{cats.map(c => <button className={category===c?'active':''} key={c} onClick={()=>setCategory(c)}>{c}</button>)}</div>
          <div className="product-grid">{visible.map(p=><article className="product-card" key={p.id} onClick={()=>openProduct(p)}><div className="product-image"><img src={p.image}/>{p.tag&&<span className="tag">{p.tag}</span>}<button aria-label={'Adicionar '+p.name}>+</button></div><div className="product-info"><div className="product-title"><h3>{p.name}</h3><b>{money(p.price)}</b></div><p>{p.description}</p><small>{p.category} · feito na hora</small></div></article>)}</div>
        </section>
        <section className="hero"><div className="hero-copy"><div className="eyebrow">Hamburgueria · Delivery e retirada</div><h1>Se tu não provou,<br/><em>tu não viveu.</em></h1><p>O hambúrguer que tu vai querer de novo. Escolhe o teu, monta o pedido e recebe quentinho em casa.</p><div className="hero-actions"><button className="primary" onClick={() => document.querySelector('#cardapio').scrollIntoView({behavior:'smooth'})}>Ver cardápio <span>↗</span></button><span className="hero-rating">★★★★★ <small>feito na hora</small></span></div><div className="hero-meta"><span>📍 Porto Alegre</span><span>🛵 Delivery e retirada</span></div></div></section>
        <section className="promo-strip"><div><small>COMBINA COM TEU PEDIDO</small><h2>Uma batata bem crocante?</h2><p>Adiciona a Batata Nask e deixa o pedido completo.</p></div><img src="/images/burger-cheese.jpg"/><button className="primary" onClick={()=>openProduct(products.find(p=>p.name==='Batata Nask'))}>Adicionar · R$ 15,90 +</button></section>
        <section className="trust-row" id="sobre"><div>🔥 <b>Feito na hora</b><small>Ingredientes frescos</small></div><div>📍 <b>Porto Alegre</b><small>Delivery e retirada</small></div><div>💳 <b>Pagamento fácil</b><small>Pix ou na entrega</small></div></section>
        <footer id="contato"><div className="brand"><img src="/images/nask-logo.jpg"/><span><b>nask burguer</b><small>Se tu não provou, tu não viveu.</small></span></div><div>Domingo 18h30–22h · Terça a sábado 18h30–23h<br/><a href="https://wa.me/5551994477357" target="_blank" rel="noreferrer">WhatsApp comercial ↗</a></div><small>© 2026 Nask Burguer · Demonstração de portfólio</small></footer>
      </main>
    </> : <Admin products={products} setProducts={setProducts} tab={adminTab} setTab={setAdminTab} back={()=>setView('shop')} orders={demoOrders} onEdit={p=>setEditing(p)} onNew={()=>setEditing({})}/>}

    {selected && <div className="overlay" onClick={()=>setSelected(null)}><div className="modal product-modal" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setSelected(null)}>×</button><img className="modal-photo" src={selected.image}/><div className="modal-content"><small className="eyebrow">{selected.category}</small><h2>{selected.name}</h2><p>{selected.description}</p><div className="choice-title">Quer adicionar algo?</div>{extras.map(x=><label className="choice" key={x.name}><span>{x.name}<small>+ {money(x.price)}</small></span><input type="checkbox" checked={extraNames.includes(x.name)} onChange={e=>setExtraNames(a=>e.target.checked?[...a,x.name]:a.filter(n=>n!==x.name))}/></label>)}<div className="choice-title">Quer remover algum ingrediente?</div><div className="remove-list">{['Queijo','Cebola','Picles','Molho da casa','Alface'].map(x=><label key={x}><input type="checkbox" checked={removed.includes(x)} onChange={e=>setRemoved(a=>e.target.checked?[...a,x]:a.filter(n=>n!==x))}/>{x}</label>)}</div><label className="notes-label">Observações<textarea placeholder="Ex.: ponto da carne, alergia..." value={notes} onChange={e=>setNotes(e.target.value)} maxLength={180}/></label><button className="primary wide" onClick={addConfigured}>Adicionar à sacola · {money(selected.price+extras.filter(x=>extraNames.includes(x.name)).reduce((n,x)=>n+x.price,0))}</button></div></div></div>}
    {showCart && <div className="overlay" onClick={()=>setShowCart(false)}><aside className="drawer" onClick={e=>e.stopPropagation()}><div className="drawer-head"><div><small className="eyebrow">Seu pedido</small><h2>Sacola <span>({cartCount})</span></h2></div><button className="close" onClick={()=>setShowCart(false)}>×</button></div>{cart.length===0?<div className="empty">Sua sacola ainda está vazia.<button className="primary" onClick={()=>setShowCart(false)}>Escolher meu lanche</button></div>:<><div className="cart-items">{cart.map(row=><div className="cart-row" key={row.key}><img src={row.product.image}/><div className="cart-description"><b>{row.product.name}</b><small>{row.additions.length?`+ ${row.additions.join(', ')}`:'Personalizado'}{row.removed.length?` · sem ${row.removed.join(', ')}`:''}</small>{row.notes&&<small>Obs.: {row.notes}</small>}<strong>{money(row.price*row.qty)}</strong></div><div className="qty"><button onClick={()=>changeQty(row.key,-1)}>−</button>{row.qty}<button onClick={()=>changeQty(row.key,1)}>+</button></div></div>)}<button className="suggestion" onClick={()=>{setShowCart(false);openProduct(products.find(p=>p.name==='Batata Nask'))}}><span>🍟</span><span><b>Combina com teu pedido</b><small>Batata Nask · R$ 15,90</small></span><strong>Adicionar +</strong></button></div><div className="cart-foot"><div className="cart-line"><span>Subtotal</span><b>{money(subtotal)}</b></div><div className="cart-line"><span>Entrega estimada</span><b>{money(delivery)}</b></div><div className="cart-line total"><span>Total</span><b>{money(total)}</b></div><button className="primary wide" onClick={()=>{setShowCart(false);setCheckout(true)}}>Continuar para entrega</button></div></>}</aside></div>}
    {checkout && <div className="overlay" onClick={()=>setCheckout(false)}><div className="modal checkout-modal" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setCheckout(false)}>×</button><small className="eyebrow">Quase lá</small><h2>Finalizar pedido</h2><div className="order-switch"><button className={orderType==='Delivery'?'selected':''} onClick={()=>setOrderType('Delivery')}>🛵 Delivery</button><button className={orderType==='Retirada'?'selected':''} onClick={()=>setOrderType('Retirada')}>🛍️ Retirada</button></div><form onSubmit={finishOrder}><div className="fields"><label>Seu nome<input required value={address.name} onChange={e=>setAddress({...address,name:e.target.value})} placeholder="Como podemos te chamar?"/></label><label>WhatsApp<input required value={address.phone} onChange={e=>setAddress({...address,phone:e.target.value})} placeholder="(51) 99999-9999"/></label>{orderType==='Delivery'&&<><label className="full">Endereço<input required value={address.street} onChange={e=>setAddress({...address,street:e.target.value})} placeholder="Rua, avenida..."/></label><label>Número<input required value={address.number} onChange={e=>setAddress({...address,number:e.target.value})}/></label><label>Bairro<input required value={address.neighborhood} onChange={e=>setAddress({...address,neighborhood:e.target.value})}/></label><label className="full">Complemento<input value={address.complement} onChange={e=>setAddress({...address,complement:e.target.value})} placeholder="Apto, referência (opcional)"/></label></>}</div><div className="choice-title">Forma de pagamento</div><div className="pay-options">{['Pix','Cartão na entrega','Dinheiro'].map(x=><button type="button" className={payment===x?'selected':''} onClick={()=>setPayment(x)} key={x}>{x}</button>)}</div><div className="checkout-total"><span>Total demonstrativo</span><b>{money(total)}</b></div><button className="primary wide" type="submit">Confirmar pedido de demonstração</button><p className="fine-print">Não há cobrança nem envio real. Este fluxo é apenas uma demonstração visual.</p></form></div></div>}
    {success&&<div className="overlay" onClick={()=>setSuccess(false)}><div className="modal success-modal" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setSuccess(false)}>×</button><div className="success-icon">✓</div><small className="eyebrow">Demonstração</small><h2>Pedido montado!</h2><p>Este pedido é fictício e não foi enviado à loja. Na versão final, a loja receberá os dados no painel e poderá acompanhar a entrega.</p><button className="primary wide" onClick={()=>setSuccess(false)}>Voltar ao cardápio</button></div></div>}
    {editing && <div className="overlay" onClick={()=>setEditing(null)}><form className="modal edit-modal" onClick={e=>e.stopPropagation()} onSubmit={saveProduct}><button type="button" className="close" onClick={()=>setEditing(null)}>×</button><small className="eyebrow">Área da loja · demonstração</small><h2>{editing.id?'Editar produto':'Novo produto'}</h2><label>Nome<input name="name" required defaultValue={editing.name}/></label><label>Categoria<select name="category" defaultValue={editing.category||'Hambúrgueres'}>{['Promoções','Hambúrgueres','Acompanhamentos','Combos','Bebidas'].map(x=><option>{x}</option>)}</select></label><label>Preço (R$)<input name="price" type="number" min="0" step="0.01" required defaultValue={editing.price}/></label><label>Descrição<textarea name="description" defaultValue={editing.description}/></label><button className="primary wide">Salvar produto</button></form></div>}
    {toast&&<div className="toast">✓ {toast}</div>}
  </>;
}

function Admin({products,setProducts,tab,setTab,back,orders,onEdit,onNew}) {
  const tabs=['Visão geral','Pedidos e entregas','Produtos','Relatórios'];
  const [selectedOrders,setSelectedOrders]=useState(orders.map(o=>o.id));
  const routeUrl='https://www.google.com/maps/dir/'+orders.filter(o=>selectedOrders.includes(o.id)).map(o=>encodeURIComponent(o.address.replace(/ · .*/,', Porto Alegre, RS'))).join('/');
  const toggle = id=>setSelectedOrders(a=>a.includes(id)?a.filter(x=>x!==id):[...a,id]);
  return <main className="admin-page"><div className="admin-header"><div><div className="eyebrow">Painel da loja · demonstração</div><h1>Nask <span>Burguer</span></h1></div><div className="admin-head-actions"><button className="secondary" onClick={back}>← Voltar ao cardápio</button><button className="secondary">⚙ Configurações</button></div></div><nav className="admin-tabs">{tabs.map(t=><button className={tab===t?'active':''} onClick={()=>setTab(t)}>{t}</button>)}</nav>
    {tab==='Visão geral'&&<><div className="admin-subtitle"><h2>Resumo da operação</h2><span>Dados fictícios para demonstração</span></div><div className="stat-grid"><Stat label="Vendas hoje" value="R$ 1.284,50" note="↑ 12% vs. ontem"/><Stat label="Pedidos recebidos" value="32" note="8 aguardando preparo"/><Stat label="Ticket médio" value="R$ 40,14" note="↑ R$ 3,20 neste mês"/><Stat label="Em entrega" value="3" note="Endereços fictícios"/></div><AdminOrders orders={orders}/><AdminMap orders={orders} selected={selectedOrders} toggle={toggle} routeUrl={routeUrl}/></>}
    {tab==='Pedidos e entregas'&&<><div className="admin-subtitle"><h2>Pedidos e entregas</h2><span>Selecione os endereços para montar uma rota</span></div><AdminOrders orders={orders}/><AdminMap orders={orders} selected={selectedOrders} toggle={toggle} routeUrl={routeUrl}/></>}
    {tab==='Produtos'&&<><div className="admin-subtitle"><div><h2>Produtos do cardápio</h2><span>Cadastre, edite ou pause itens neste navegador</span></div><button className="primary" onClick={onNew}>＋ Novo produto</button></div><div className="admin-products">{products.map(p=><div className="admin-product" key={p.id}><img src={p.image}/><div><b>{p.name}</b><small>{p.category} · {money(p.price)} · {p.active?'Ativo':'Pausado'}</small></div><button className="secondary" onClick={()=>onEdit(p)}>Editar</button><button className="secondary" onClick={()=>setProducts(a=>a.map(x=>x.id===p.id?{...x,active:!x.active}:x))}>{p.active?'Pausar':'Ativar'}</button></div>)}</div></>}
    {tab==='Relatórios'&&<><div className="admin-subtitle"><h2>Relatórios demonstrativos</h2><span>Valores ilustrativos</span></div><div className="stat-grid"><Stat label="Faturamento no mês" value="R$ 28.940" note="Período demonstrativo"/><Stat label="Total de pedidos" value="718" note="Pedidos de teste"/><Stat label="Mais vendido" value="QuarterNask" note="146 unidades"/><Stat label="Vendas via Pix" value="64%" note="Distribuição ilustrativa"/></div><div className="report-card"><h3>Vendas por dia da semana</h3><div className="bars">{[['SEG',45],['TER',68],['QUA',54],['QUI',77],['SEX',88],['SÁB',100],['DOM',61]].map(([d,v])=><div><span style={{height:v+'%'}}></span><small>{d}</small></div>)}</div><p>Gráfico visual com dados fictícios para apresentar o painel.</p></div><div className="report-card products-report"><h3>Resumo de produtos</h3>{[['QuarterNask',146],['Ragu',121],['Batata Nask',98],['Refrigerante lata',83],['Outros itens',270]].map(([n,v])=><div><span>{n}</span><b>{v} un.</b><i style={{width:Math.min(v/2.7,100)+'%'}}/></div>)}</div></>}
    <p className="demo-note">Este painel é um protótipo visual. Pedidos, faturamento, endereços e gráficos não são reais.</p>
  </main>;
}
function Stat({label,value,note}) { return <article className="stat-card"><small>{label}</small><b>{value}</b><span>{note}</span></article> }
function AdminOrders({orders}) { return <section className="admin-card"><div className="card-head"><div><h3>Pedidos recentes</h3><small>Hoje, 19:00–20:00</small></div><button className="secondary">Ver todos</button></div><div className="table-wrap"><table><thead><tr><th>Pedido</th><th>Cliente / endereço</th><th>Total</th><th>Status</th></tr></thead><tbody>{orders.map(o=><tr><td>#{o.id}</td><td><b>{o.client}</b><small>{o.address}</small></td><td>{money(o.total)}</td><td><span className={'status '+(o.status==='Pronto'?'ready':'')}>{o.status}</span></td></tr>)}<tr><td>#2038</td><td><b>Bia S.</b><small>Retirada na loja</small></td><td>R$ 47,80</td><td><span className="status ready">Pronto</span></td></tr></tbody></table></div></section> }
function AdminMap({orders,selected,toggle,routeUrl}) { return <section className="admin-card map-card"><div className="card-head"><div><h3>Entregas no mapa</h3><small>Porto Alegre, RS · endereços de demonstração</small></div><a className="primary map-link" href={routeUrl} target="_blank" rel="noreferrer">↗ Gerar rota no Google Maps</a></div><div className="map-content"><div className="fake-map"><div className="map-water"></div><span className="road r1">R. MOSTARDEIRO</span><span className="road r2">AV. INDEPENDÊNCIA</span><span className="road r3">R. FELIPE CAMARÃO</span><div className="route-line"></div>{orders.map((o,i)=><button className={'pin pin'+i} style={{top:o.lat+'%',left:o.left+'%'}} onClick={()=>toggle(o.id)}>{selected.includes(o.id)?i+1:'+'}</button>)}<div className="map-legend">📍 Pins ilustrativos · endereços de teste, não são entregas reais</div></div><div className="map-orders">{orders.map((o,i)=><label className="map-order"><input type="checkbox" checked={selected.includes(o.id)} onChange={()=>toggle(o.id)}/><span><b>#{o.id} · {o.client}</b><small>{o.address}</small></span></label>)}<p>Selecione os pedidos que o motoboy fará nesta rota.</p></div></div></section> }

createRoot(document.getElementById('root')).render(<App/>);
