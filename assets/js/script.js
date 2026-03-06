// 0. CONFIGURACIÓN DE RUTA PARA GITHUB PAGES
const BASE_URL = "/portfolio"; 

// 1. LÓGICA DE NAVEGACIÓN SPA
function showView(viewName, skipScroll = false) {
    const homeWrapper = document.getElementById('home-view-wrapper');
    const workView = document.getElementById('view-work');
    const aboutView = document.getElementById('view-about');
    const btnWork = document.getElementById('btn-work');
    const btnAbout = document.getElementById('btn-about');

    const active = ['bg-[#FFAE2C]', 'text-white', 'shadow-lg', 'shadow-[#FFAE2C]/30', 'border-transparent'];
    const inactive = ['border-black/10', 'dark:border-white/20', 'bg-slate-300/50', 'dark:bg-white/10', 'backdrop-blur-md', 'text-slate-700', 'dark:text-white'];

    // Ocultar todos los proyectos
    document.querySelectorAll('[id*="view-project"]').forEach(v => v.classList.add('hidden'));

    if (viewName.toLowerCase().startsWith('project')) {
        homeWrapper.classList.add('hidden');
        const targetProject = document.getElementById('view-' + viewName);
        if (targetProject) targetProject.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Inicializar vistas específicas si existen
        setTimeout(() => {
            if (window.initTgNav) window.initTgNav();
            if (window.initNvNav) window.initNvNav();
        }, 100);
        return;
    }

    homeWrapper.classList.remove('hidden');
    if (!skipScroll) window.scrollTo({ top: 0, behavior: 'smooth' });

    if (viewName === 'work') {
        workView.classList.remove('hidden');
        aboutView.classList.add('hidden');
        btnWork.classList.remove(...inactive); btnWork.classList.add(...active);
        btnAbout.classList.remove(...active); btnAbout.classList.add(...inactive);
    } else {
        workView.classList.add('hidden');
        aboutView.classList.remove('hidden');
        btnAbout.classList.remove(...inactive); btnAbout.classList.add(...active);
        btnWork.classList.remove(...active); btnWork.classList.add(...inactive);
        showAboutTab('exp', true);
    }
}

// 2. BASE DE DATOS DE PROYECTOS (Rutas Corregidas)
const projects = [
    { 
        title: "Diseño y Desarrollo de la App testGO", 
        category: "UX/UI", 
        tags: ["Diseño UX/UI", "Figma"], 
        img: BASE_URL + "/assets/img/testgo/desktop/sec-portada_multi.webp", 
        view: "project-testGO" 
    },
    {
        title: "Identidad Visual de Novateca",
        category: "Graphic Design",
        tags: ["Diseño Gráfico", "Branding"],
        img: BASE_URL + "/assets/img/novateca/desktop/portada_multi.gif",
        view: "project-Novateca"
    }
];

// 3. RENDERIZADO DE PROYECTOS
function renderProjects(filter = 'all') {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;
    grid.innerHTML = '';
    const filtered = filter === 'all' ? projects : projects.filter(p => p.category === filter);
    
    filtered.forEach(p => {
        const card = document.createElement('div');
        card.className = "project-card-animate group cursor-pointer relative aspect-[4/5] overflow-hidden rounded-3xl bg-slate-900 shadow-2xl transition-all hover:-translate-y-2";
        card.onclick = () => showView(p.view);
        card.innerHTML = `
            <div class="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style="background-image: url('${p.img}')"></div>
            <div class="absolute inset-0 bg-gradient-to-t from-[#101622] via-[#101622]/40 to-transparent"></div>
            <div class="absolute bottom-0 p-8">
                <h3 class="text-2xl font-bold text-white mb-3">${p.title}</h3>
                <div class="flex flex-wrap gap-2">${p.tags.map(t => `<span class="bg-white/10 px-3 py-1 rounded-full text-xs text-white">${t}</span>`).join('')}</div>
            </div>`;
        grid.appendChild(card);
    });
}

// 4. THEME & INITIALIZATION
function applyTheme(isDark) {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    if (typeof updateTgImages === "function") updateTgImages();
    if (typeof updateNvImages === "function") updateNvImages();
}

function goToProjects() {
    showView('work');
}

document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme === 'dark');
    renderProjects('all');

    const themeSwitch = document.getElementById('theme-switch');
    if(themeSwitch) {
        themeSwitch.checked = (savedTheme === 'dark');
        themeSwitch.addEventListener('change', () => applyTheme(themeSwitch.checked));
    }
});

// Scroll Listener (Header & Back Button)
let lastScrollY = window.scrollY;
window.addEventListener('scroll', () => {
    const header = document.getElementById('header-wrapper');
    const backBtn = document.getElementById('btn-back-to-work');
    const isProjectView = document.getElementById('home-view-wrapper').classList.contains('hidden');

    if (window.scrollY > lastScrollY && window.scrollY > 100) {
        header.style.transform = 'translateY(-110%)';
        document.body.classList.add('header-hidden');
    } else {
        header.style.transform = 'translateY(0)';
        document.body.classList.remove('header-hidden');
    }

    if (isProjectView && window.scrollY > 300) {
        backBtn.classList.remove('translate-y-32', 'opacity-0', 'pointer-events-none');
    } else {
        backBtn.classList.add('translate-y-32', 'opacity-0', 'pointer-events-none');
    }
    lastScrollY = window.scrollY;
}, { passive: true });
