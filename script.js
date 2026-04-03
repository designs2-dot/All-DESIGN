/* Minimal JS to power navigation, projects grid, filters and modal */
/* Replace project data with your own items or fetch from API if needed */

const projects = [
  {
    id: "p1",
    title: "Portfolio Website",
    desc: "A responsive portfolio website with animations and CMS-free content.",
    tags: ["web","ui"],
    img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200&auto=format&fit=crop",
    url: "#",
    code: "#"
  },
  {
    id: "p2",
    title: "E‑commerce UI",
    desc: "Design system and front-end for a small e-commerce shop.",
    tags: ["web","ui"],
    img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop",
    url: "#",
    code: "#"
  },
  {
    id: "p3",
    title: "Mobile App Concept",
    desc: "Mobile-first concept prototype with interactive flows.",
    tags: ["mobile","ui"],
    img: "https://images.unsplash.com/photo-1518552785457-3a8dff0b3b3f?q=80&w=1200&auto=format&fit=crop",
    url: "#",
    code: "#"
  },
  {
    id: "p4",
    title: "Dashboard",
    desc: "Data-heavy dashboard with charts and filters.",
    tags: ["web"],
    img: "https://images.unsplash.com/photo-1556155092-490a1ba16284?q=80&w=1200&auto=format&fit=crop",
    url: "#",
    code: "#"
  },
  {
    id: "p5",
    title: "Branding & Collateral",
    desc: "Design assets and brand system for a startup.",
    tags: ["ui"],
    img: "https://images.unsplash.com/photo-1487014679447-9f8336841d58?q=80&w=1200&auto=format&fit=crop",
    url: "#",
    code: "#"
  },
  {
    id: "p6",
    title: "Progressive Web App",
    desc: "Fast PWA with offline-first caching and modern patterns.",
    tags: ["web","mobile"],
    img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
    url: "#",
    code: "#"
  }
];

/* DOM elements */
const projectsGrid = document.getElementById('projectsGrid');
const filtersEl = document.getElementById('filters');
const searchInput = document.getElementById('searchProjects');
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
const modal = document.getElementById('projectModal');
const modalClose = document.getElementById('modalClose');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalTech = document.getElementById('modalTech');
const modalView = document.getElementById('modalView');
const modalCode = document.getElementById('modalCode');

/* render projects */
function renderProjects(list){
  projectsGrid.innerHTML = '';
  if(list.length === 0){
    projectsGrid.innerHTML = '<p class="muted">No projects found</p>';
    return;
  }
  list.forEach(p => {
    const card = document.createElement('article');
    card.className = 'project-card';
    card.tabIndex = 0;
    card.setAttribute('role','button');
    card.dataset.id = p.id;
    card.innerHTML = `
      <div class="project-media"><img loading="lazy" src="${p.img}" alt="${escapeHtml(p.title)}"></div>
      <div class="project-body">
        <p class="project-tag">${p.tags.join(' · ')}</p>
        <h4 class="project-title">${escapeHtml(p.title)}</h4>
        <p class="project-excerpt" style="color:var(--muted);font-size:0.95rem;margin-top:6px">${escapeHtml(p.desc)}</p>
      </div>
    `;
    card.addEventListener('click', ()=> openProject(p.id));
    card.addEventListener('keydown', (e) => { if(e.key === 'Enter') openProject(p.id) });
    projectsGrid.appendChild(card);
  });
}

/* safe text */
function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

/* filter logic */
let activeFilter = '*';
let query = '';

function filterProjects(){
  const q = query.trim().toLowerCase();
  const filtered = projects.filter(p => {
    const byFilter = (activeFilter === '*' ? true : p.tags.includes(activeFilter));
    const byQuery = q === '' ? true : (
      p.title.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q) ||
      p.tags.join(' ').toLowerCase().includes(q)
    );
    return byFilter && byQuery;
  });
  renderProjects(filtered);
}

/* attach filter buttons */
filtersEl.addEventListener('click', (e)=>{
  const btn = e.target.closest('button.chip');
  if(!btn) return;
  Array.from(filtersEl.querySelectorAll('.chip')).forEach(c=>c.classList.remove('active'));
  btn.classList.add('active');
  activeFilter = btn.dataset.filter;
  filterProjects();
});

/* search */
searchInput.addEventListener('input', (e)=>{
  query = e.target.value;
  filterProjects();
});

/* open modal */
function openProject(id){
  const p = projects.find(x => x.id === id);
  if(!p) return;
  modalImage.src = p.img;
  modalImage.alt = p.title;
  modalTitle.textContent = p.title;
  modalDesc.textContent = p.desc;
  modalTech.textContent = p.tags.join(', ');
  modalView.href = p.url;
  modalCode.href = p.code;
  modal.setAttribute('aria-hidden','false');
  document.body.style.overflow = 'hidden';
}

/* close modal */
function closeModal(){
  modal.setAttribute('aria-hidden','true');
  document.body.style.overflow = '';
}

/* modal events */
modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e)=> { if(e.target === modal) closeModal(); });
document.addEventListener('keydown', (e)=> { if(e.key === 'Escape') closeModal(); });

/* nav toggle for small screens */
navToggle.addEventListener('click', ()=> {
  const expanded = mainNav.style.display === 'block';
  mainNav.style.display = expanded ? '' : 'block';
});

/* smooth scroll for nav links */
document.querySelectorAll('.nav-link').forEach(a=>{
  a.addEventListener('click', (e)=>{
    e.preventDefault();
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if(el){
      el.scrollIntoView({behavior:'smooth',block:'start'});
      // close nav on mobile
      if(window.innerWidth < 720) mainNav.style.display = '';
    }
  });
});

/* contact form placeholder behavior */
document.getElementById('contactForm').addEventListener('submit', (e)=>{
  e.preventDefault();
  alert('This demo contact form does not send messages. Hook it to your backend or a service like Formspree.');
});

/* initial render */
renderProjects(projects);

/* set year */
document.getElementById('year').textContent = new Date().getFullYear();
