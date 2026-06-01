import express from "express";
import path from "path";
import fs from "fs";
import cookieParser from "cookie-parser";
import { Resend } from "resend";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import "dotenv/config";
import {
  checkLoginRateLimit,
  clearLoginAttempts,
  clearSessionCookie,
  getAdminConfig,
  getSessionFromRequest,
  recordFailedLogin,
  requireAdmin,
  setSessionCookie,
  createSessionToken,
  verifyPassword,
  verifyTotp,
} from "./server/auth";
import { escapeHtml, securityHeaders } from "./server/security";

// Lazy-initialized Gemini Client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("A chave de API GEMINI_API_KEY não foi encontrada configurada no ambiente.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        }
      }
    });
  }
  return aiClient;
}

const app = express();
const PORT = 3000;

app.use(securityHeaders);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "database.json");

// Ensure the data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial Mockup Data
const initialProjects = [
  {
    id: "proj_modular",
    title: "Projeto Modular Premium",
    category: "Residencial",
    description: "Módulos acoplados de alto padrão, combinando containers para uma residência de área expandida, design moderno e acabamento impecável.",
    badge: "Destaque",
    imageUrl: "",
    gallery: [
      "",
      ""
    ],
    priceEstimate: 145000,
    dimensions: "60m² - 2 Módulos de 40 pés",
    rooms: "2 Quartos, 1 Suíte, Sala de Estar e Cozinha Integrada",
    deliveryTime: "60 dias",
    specs: [
      "Isolamento térmoacústico especial em lã de rocha",
      "Paredes internas com acabamento completo em Drywall pintado de branco",
      "Portas externas de correr panorâmicas em vidro e alumínio preto",
      "Instalações elétricas trifásicas prontas com tomadas e interruptores premium",
      "Banheiro completo com box de vidro blindex, bacia sanitária e revestimento cerâmico"
    ]
  },
  {
    id: "casa_comercial",
    title: "Casa / Escritório Comercial",
    category: "Comercial / Residencial",
    description: "Espaço híbrido ideal para moradia prática ou sede comercial com design contemporâneo e excelente iluminação natural.",
    badge: "Versátil",
    imageUrl: "",
    gallery: [
      ""
    ],
    priceEstimate: 85000,
    dimensions: "30m² - 1 Módulo de 40 pés",
    rooms: "Layout Open Plan (Customizável) com 1 Banheiro Completo",
    deliveryTime: "45 dias",
    specs: [
      "Isolamento térmico em Poliuretano (PU) expandido de alta densidade",
      "Piso vinílico amadeirado de alta resistência (tráfego intenso)",
      "Pintura externa em esmalte sintético automotivo naval cinza grafite",
      "Luminárias embutidas de LED em sanca de gesso acústico",
      "Pontos hidráulicos e elétricos sob medida para copa ou cozinha compacta"
    ]
  },
  {
    id: "vitrine_atendimento",
    title: "Vitrine / Comercial High-Tech",
    category: "Comercial",
    description: "Espaço comercial ou showroom com fachada inteira de vidro temperado duplo, maximizando a visão dos seus produtos e o apelo visual.",
    badge: "Lançamento",
    imageUrl: "",
    gallery: [
      ""
    ],
    priceEstimate: 68000,
    dimensions: "15m² - 1 Módulo de 20 pés",
    rooms: "Espaço Amplo de Atendimento com Lavabo Social",
    deliveryTime: "30 dias",
    specs: [
      "Fachada frontal panorâmica em vidro temperado de 10mm com esquadrias pretas",
      "Isolamento estrutural acústico reforçado",
      "Piso cerâmico cinza marmorizado de fácil higienização",
      "Deck frontal de 3 metros em madeira Pinus auto-clavada tratada",
      "Espera para ar-condicionado Split de até 12.000 BTUs"
    ]
  },
  {
    id: "modulo_40pes",
    title: "Módulo Lazer 40 Pés",
    category: "Residencial / Lazer",
    description: "Módulo perfeito para chácaras, praias ou lazer aos finais de semana, com deck suspenso acolhedor e acabamentos rústico-chiques.",
    badge: "Mais Vendido",
    imageUrl: "",
    gallery: [
      ""
    ],
    priceEstimate: 115000,
    dimensions: "30m² - 1 Módulo de 40 pés",
    rooms: "Suíte Master Separada, Cozinha de Apoio e Sala Estar Integrada",
    deliveryTime: "50 dias",
    specs: [
      "Isolamento térmoacústico completo com placas EPS e drywall anti-umidade",
      "Piso vinílico de madeira carvalho clássico",
      "Banheiro completo com revestimento cerâmico até o teto e chuveiro elétrico",
      "Cozinha americana com bancada de granito São Gabriel preto",
      "Janelas maxim-ar que favorecem a circulação cruzada do vento"
    ]
  }
];

const initialBlogs = [
  {
    id: "insulacao",
    title: "Isolamento Térmico em Containers: Qual o ideal para seu clima?",
    summary: "Descubra a diferença de desempenho entre lã de rocha, poliuretano injetado (PU) e placas EPS para manter sua casa fresca no verão e quente no inverno.",
    content: `Ao planejar sua casa container, o quesito mais crítico para o conforto é o **isolamento termoacústico**. Sem ele, a estrutura de aço atuará como um receptor térmico extremo.

### Opções principais de Isolamento:
1. **Lã de Rocha (Lã Mineral)**: Altamente recomendada por ter excelente desempenho térmico e, acima de tudo, o melhor isolamento contra barulhos. Também é totalmente incombustível (segurança total contra fogo).
2. **Poliuretano Injetado (PU)**: Spray que se expande aderindo diretamente à chapa metálica. Fecha completamente qualquer fresta física contra ar e umidade. Perfeito para regiões de umidade alta ou beira de praia.
3. **Poliestireno Expandido (EPS)**: Uma alternativa econômica e leve. Oferece boa proteção térmica geral se bem vedada na montagem.

Recomendamos investir sempre em painéis Drywall para fechar a parede por dentro de forma totalmente lisa e pintável, gerando o visual de alvenaria tradicional.`,
    category: "Construção",
    imageUrl: "",
    readTime: "5 min",
    date: "24 de Maio, 2026"
  },
  {
    id: "permissoes",
    title: "Como regularizar uma Casa Container na sua Prefeitura",
    summary: "Entenda o passo a passo legal: zoneamento, alvará de construção, projeto hidrossanitário e como conseguir aprovação sem dores de cabeça.",
    content: `Uma das maiores dúvidas de quem deseja construir com containers é: *"Precisa de autorização da prefeitura?"* \nA resposta curta é: **Sim, pois se trata de uma habitação fixa.**

### Roteiro essencial para aprovação:
- **Zoneamento local**: Verifique na Secretaria de Planejamento se o terreno permite construções do tipo.
- **Projeto assinado**: É necessário contar com um Engenheiro ou Arquiteto para o desenho do projeto hidrossanitário, elétrico e memorial descritivo.
- **Fundação adequada**: Embora mais leve, a estrutura necessita de pilares ou sapatas de concreto.
- **Habite-se**: Ao final da montagem, a vistoria municipal audita as ligações de luz e fossa/esgoto para conceder o documento final.

Fabricar com uma empresa parceira como a **Delivery Container** facilita muito, pois fornecemos cadernos técnicos e plantas prontas para o seu engenheiro dar entrada com agilidade.`,
    category: "Legislação",
    imageUrl: "",
    readTime: "4 min",
    date: "12 de Maio, 2026"
  }
];

const initialSettings = {
  resendApiKey: "",
  notifiedEmail: "lorem.ipsum@placeholder.com",
  senderEmail: "lorem.ipsum@placeholder.com"
};

// Initialize DB Function
function readDB() {
  if (!fs.existsSync(DB_FILE)) {
    const data = {
      projects: initialProjects,
      leads: [],
      blogs: initialBlogs,
      settings: initialSettings
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    return data;
  }
  try {
    const text = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(text);
  } catch (err) {
    console.error("Error reading database file, resetting storage...", err);
    const data = {
      projects: initialProjects,
      leads: [],
      blogs: initialBlogs,
      settings: initialSettings
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    return data;
  }
}

function writeDB(data: any) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// --- Admin authentication (server-side session + optional TOTP) ---

app.get("/api/admin/me", (req, res) => {
  const config = getAdminConfig();
  if (!config) {
    res.json({ authenticated: false, configured: false });
    return;
  }
  const session = getSessionFromRequest(req, config);
  if (!session) {
    res.json({
      authenticated: false,
      configured: true,
      totpRequired: Boolean(config.totpSecret),
    });
    return;
  }
  res.json({
    authenticated: true,
    configured: true,
    username: session.sub,
    totpRequired: Boolean(config.totpSecret),
  });
});

app.post("/api/admin/login", async (req, res) => {
  const config = getAdminConfig();
  if (!config) {
    res.status(503).json({
      error:
        "Painel admin não configurado no servidor. Defina ADMIN_SESSION_SECRET e ADMIN_PASSWORD_HASH.",
    });
    return;
  }

  const rate = checkLoginRateLimit(req);
  if (!rate.allowed) {
    res.status(429).json({
      error: `Muitas tentativas. Aguarde ${rate.retryAfterSec} segundos.`,
    });
    return;
  }

  const { username, password, totp } = req.body ?? {};

  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    username !== config.username ||
    !(await verifyPassword(password, config.passwordHash))
  ) {
    recordFailedLogin(req);
    res.status(401).json({ error: "Credenciais inválidas." });
    return;
  }

  if (config.totpSecret) {
    if (typeof totp !== "string" || !verifyTotp(totp, config.totpSecret)) {
      recordFailedLogin(req);
      res.status(401).json({
        error: "Código de autenticação (2FA) inválido ou ausente.",
        totpRequired: true,
      });
      return;
    }
  }

  clearLoginAttempts(req);
  const token = createSessionToken(config.username, config.sessionSecret);
  setSessionCookie(res, token, config);
  res.json({
    success: true,
    username: config.username,
    totpRequired: Boolean(config.totpSecret),
  });
});

app.post("/api/admin/logout", (req, res) => {
  const config = getAdminConfig();
  if (config) clearSessionCookie(res, config);
  res.json({ success: true });
});

// REST Api routes

app.get("/api/projects", (req, res) => {
  const db = readDB();
  res.json(db.projects || []);
});

app.post("/api/projects", requireAdmin, (req, res) => {
  const db = readDB();
  const newProject = {
    id: "proj_" + Math.random().toString(36).substring(2, 9),
    gallery: [],
    specs: [],
    ...req.body
  };
  db.projects = db.projects || [];
  db.projects.push(newProject);
  writeDB(db);
  res.status(201).json(newProject);
});

app.put("/api/projects/:id", requireAdmin, (req, res) => {
  const db = readDB();
  db.projects = db.projects || [];
  const idx = db.projects.findIndex((p: any) => p.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: "Project not found" });
    return;
  }
  db.projects[idx] = { ...db.projects[idx], ...req.body };
  writeDB(db);
  res.json(db.projects[idx]);
});

app.delete("/api/projects/:id", requireAdmin, (req, res) => {
  const db = readDB();
  db.projects = db.projects || [];
  const initialLen = db.projects.length;
  db.projects = db.projects.filter((p: any) => p.id !== req.params.id);
  if (db.projects.length === initialLen) {
    res.status(404).json({ error: "Project not found" });
    return;
  }
  writeDB(db);
  res.json({ success: true, message: "Project deleted successfully" });
});

app.get("/api/leads", requireAdmin, (req, res) => {
  const db = readDB();
  res.json(db.leads || []);
});

app.post("/api/leads", async (req, res) => {
  const db = readDB();
  const { name, email, phone, message, projectInterest, targetBudget } = req.body;

  if (!name || !email || !phone) {
    res.status(400).json({ error: "Nome, e-mail e telefone são campos obrigatórios." });
    return;
  }

  const newLead = {
    id: "lead_" + Math.random().toString(36).substring(2, 9),
    name,
    email,
    phone,
    message,
    projectInterest,
    status: 'novo',
    createdAt: new Date().toISOString(),
    targetBudget: Number(targetBudget) || undefined
  };

  db.leads = db.leads || [];
  db.leads.push(newLead);
  writeDB(db);

  // Send Email with Resend!
  const apiKey = process.env.RESEND_API_KEY || db.settings?.resendApiKey;
  const notifiedEmail = db.settings?.notifiedEmail || "lorem.ipsum@placeholder.com";
  const senderEmail = db.settings?.senderEmail || "lorem.ipsum@placeholder.com";

  let emailSent = false;
  let emailError = null;

  if (apiKey) {
    try {
      const resend = new Resend(apiKey);
      console.log(`Sending budget lead email. Sender: ${senderEmail}, Notified: ${notifiedEmail}`);

      // HTML client layout
      const budgetText = targetBudget ? `R$ ${Number(targetBudget).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : "Não informado";
      const htmlBody = `
        <div style="font-family: sans-serif; color: #1a1d1f; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
          <div style="background-color: #c41e1e; padding: 24px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 24px; font-weight: bold; letter-spacing: -0.5px;">Delivery Container</h1>
            <p style="margin: 4px 0 0 0; font-size: 14px; opacity: 0.9;">Novo Orçamento Solicitado!</p>
          </div>
          <div style="padding: 24px;">
            <p style="font-size: 16px; margin-top: 0; line-height: 1.5;">Olá! Um novo lead acaba de reter interesse em nosso catálogo. Seguem as informações preenchidas:</p>
            
            <div style="background-color: #f5f5f5; border-radius: 8px; padding: 16px; margin: 20px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; width: 120px;">Nome:</td>
                  <td style="padding: 6px 0;">${escapeHtml(name)}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold;">E-mail:</td>
                  <td style="padding: 6px 0;">${escapeHtml(email)}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold;">Telefone:</td>
                  <td style="padding: 6px 0;">${escapeHtml(phone)}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold;">Projeto:</td>
                  <td style="padding: 6px 0; font-weight: bold; color: #111;">${escapeHtml(projectInterest || "Qualquer Modelo / Geral")}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold;">Orçamento:</td>
                  <td style="padding: 6px 0; color: #c41e1e; font-weight: bold;">${escapeHtml(budgetText)}</td>
                </tr>
              </table>
            </div>

            <h3 style="font-size: 16px; margin-bottom: 8px; color: #1a1d1f;">Mensagem do Cliente:</h3>
            <blockquote style="margin: 0; padding: 12px 16px; background-color: #fafafa; border-left: 4px solid #c41e1e; font-style: italic; color: #555; border-radius: 4px;">
              ${escapeHtml(message || "Nenhuma mensagem complementar enviada.")}
            </blockquote>

            <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #eaeaea; text-align: center; font-size: 12px; color: #777;">
              Este e-mail foi disparado automaticamente pelo sistema de leads Delivery Container.
            </div>
          </div>
        </div>
      `;

      await resend.emails.send({
        from: senderEmail,
        to: [notifiedEmail],
        subject: `Novo Orçamento: ${String(name).slice(0, 80)}`,
        html: htmlBody,
      });

      console.log("Email sent successfully!");
      emailSent = true;
    } catch (err: any) {
      console.error("Resend error sending email:", err);
      emailError = err?.message || String(err);
    }
  } else {
    console.warn("No Resend API Key located. Lead saved but email notification skipped.");
    emailError = "Nenhuma chave de API do Resend configurada. Configurar via .env ou Painel de Controle.";
  }

  res.status(201).json({
    success: true,
    lead: newLead,
    emailSent,
    emailError
  });
});

app.put("/api/leads/:id", requireAdmin, (req, res) => {
  const db = readDB();
  db.leads = db.leads || [];
  const idx = db.leads.findIndex((l: any) => l.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: "Lead not found" });
    return;
  }
  db.leads[idx] = { ...db.leads[idx], ...req.body };
  writeDB(db);
  res.json(db.leads[idx]);
});

app.delete("/api/leads/:id", requireAdmin, (req, res) => {
  const db = readDB();
  db.leads = db.leads || [];
  const initialLen = db.leads.length;
  db.leads = db.leads.filter((l: any) => l.id !== req.params.id);
  if (db.leads.length === initialLen) {
    res.status(404).json({ error: "Lead not found" });
    return;
  }
  writeDB(db);
  res.json({ success: true, message: "Lead deleted successfully" });
});

app.get("/api/blogs", (req, res) => {
  const db = readDB();
  res.json(db.blogs || []);
});

app.post("/api/blogs", requireAdmin, (req, res) => {
  const db = readDB();
  const newPost = {
    id: "blog_" + Math.random().toString(36).substring(2, 9),
    date: new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }),
    category: "Geral",
    readTime: "3 min",
    ...req.body
  };
  db.blogs = db.blogs || [];
  db.blogs.push(newPost);
  writeDB(db);
  res.status(201).json(newPost);
});

app.get("/api/settings", requireAdmin, (req, res) => {
  const db = readDB();
  const sett = db.settings || initialSettings;
  // Return masked value for API safety
  res.json({
    resendApiKey: sett.resendApiKey ? "•••••••••••••" + sett.resendApiKey.slice(-4) : "",
    notifiedEmail: sett.notifiedEmail,
    senderEmail: sett.senderEmail
  });
});

app.post("/api/settings", requireAdmin, (req, res) => {
  const db = readDB();
  const current = db.settings || initialSettings;
  const { resendApiKey, notifiedEmail, senderEmail } = req.body;

  // Only override api key if user actually typed a non-masked value
  let finalKey = current.resendApiKey;
  if (resendApiKey && !resendApiKey.includes("••••••••")) {
    finalKey = resendApiKey;
  }

  db.settings = {
    resendApiKey: finalKey,
    notifiedEmail: notifiedEmail || current.notifiedEmail,
    senderEmail: senderEmail || current.senderEmail
  };

  writeDB(db);
  res.json({
    success: true,
    settings: {
      resendApiKey: db.settings.resendApiKey ? "•••••••••••••" + db.settings.resendApiKey.slice(-4) : "",
      notifiedEmail: db.settings.notifiedEmail,
      senderEmail: db.settings.senderEmail
    }
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: "Mensagens são obrigatórias e devem ser um array." });
      return;
    }

    const ai = getGeminiClient();

    const contents = messages.map((m: any) => {
      const role = m.role === "assistant" || m.role === "model" ? "model" : "user";
      return {
        role,
        parts: [{ text: m.text || m.content || "" }]
      };
    });

    const systemInstruction = `Você é o Assistente Técnico Inteligente da "Delivery Container", uma fábrica paulista de alto padrão especializada em construções residenciais e comerciais projetadas a partir de containers navais marítimos (feitos de aço patinável de alta resistência Corten AA).
Seu objetivo é esclarecer dúvidas de forma técnica, porém simples, humana, amigável e extremamente profissional para arquitetos, engenheiros e clientes finais.

Sempre responda em Português do Brasil com tom encorajador. Utilize formatação limpa (Markdown, negritos estruturados, parágrafos curtos) para facilitar a leitura.
Seja preciso e use os detalhes oficiais de fabricação da Delivery Container a seguir para enriquecer as respostas:

1. Nossos Modelos de Catálogo e Memorial Básico:
   - "Projeto Modular Premium" (Residencial): Composto por 2 módulos de 40 pés acoplados, totalizando 60m² de área útil. Possui sala e cozinha integradas, 2 quartos (sendo 1 suíte) e banheiro social. O acabamento interno é completo em Drywall gesso acartonado pintado, com isolamento em lã de rocha especial nas paredes e teto. Entrega em 60 dias. Preço base sugerido: R$ 145.000,00.
   - "Casa / Escritório Comercial" (Híbrido): 1 módulo de 40 pés, totalizando 30m² com layout de conceito aberto e banheiro completo funcional. Acabamento interno em Drywall gesso acartonado pintado, isolamento em Poliuretano (PU) expandido de alta densidade no teto e paredes, piso vinílico amadeirado de alto tráfego e pintura externa protetiva em poliuretano naval esmalte automotivo na cor cinza grafite. Entrega em 45 dias. Preço base sugerido: R$ 85.000,00.
   - "Vitrine / Comercial High-Tech": 1 módulo de 20 pés com 15m². Apresenta uma bela fachada frontal panorâmica construída inteiramente com esquadrias de alumínio preto e vidro temperado duplo de 10mm, piso cerâmico marmorizado de fácil higienização, lavabo completo e um espaçoso deck de pinus auto-clavado tratado de 3 metros na frente. Ideal para lojas, showrooms, franquias e cafés premium. Entrega em 30 dias. Preço base sugerido: R$ 68.000,00.
   - "Módulo Lazer 40 Pés": 1 módulo de 40 pés com 30m². Excelente para sítios ou praias. Apresenta uma suíte máster reservada por alvenaria interna em drywall, cozinha americana aconchegante com bancada de granito São Gabriel preto polido e sala de estar integrada. Toda isolada com placas de EPS e drywall anti-umidade gesso verde nos pontos hidráulicos mais críticos. Entrega em 50 dias. Preço base sugerido: R$ 115.000,00.

2. Processos de Fabricação e Manutenção:
   - Estrutura Principal: Escolhemos apenas containers de classe "A" (originais de transporte marítimo, fabricados em aço Corten AA estrutural). Toda modificação respeita os cálculos estruturais de resistência naval.
   - Proteção contra ferrugem: O container passa por lixamento localizado e jateamento, seguido da aplicação de demãos de primer fosfato de zinco epóxi de proteção de alto desempenho, finalizado com esmalte automotivo de alta espessura. A durabilidade desse sistema de pintura supera 20 anos em condições severas.
   - Paredes Internas: Estruturamos perfis de metal (steel frame) distanciados da chapa metálica externa. Na cavidade do sanduíche colocamos o material isolante térmico escolhido, fechando de forma impecável com placas de gesso Drywall que recebem tratamento de juntas, massa corrida e pintura lavável.

3. Perguntas Frequentes sobre Isolamento Termoacústico:
   - Lã de Rocha (Lã Mineral): O mais alta performance térmica-acústica e totalmente à prova de fogo (incombustível). Isola com precisão o barulho de chuva, vento ou tráfego externo. Ideal para regiões urbanas e residenciais de alto padrão.
   - Poliuretano (PU) Injetado Expandido: Material polimérico selante que elimina térmicamente as pontes térmicas pois adere diretamente à chapa de aço, bloqueando totalmente qualquer entrada de calor, frio e umidade salina. Recomendamos fortemente para regiões litorâneas, de alta umidade ou climas extremos.
   - Placas de EPS: Um isolamento termoacústico econômico clássico, leve, 100% reciclável e de alto custo-benefício. Indicado para ambientes de menor oscilação térmica.

4. Normas, Fundação e Logística:
   - Todo container fixado necessita de um licenciamento simples (Alvará de construção) junto à prefeitura local, tal qual uma casa comum. Nossos projetos vêm com os cadernos técnicos e plantas para que o engenheiro/arquiteto responsável dê entrada facilmente.
   - Fundação: Não deite o container diretamente no chão orgânico! A fundação correta são pilaretes simples de concreto ou sapatas isoladas nos cantos (Castings). Isso suspende o container de 15 a 30 centímetros da terra, impedindo que a umidade deteriore o assoalho e facilitando a ligação e manutenção hidráulica/esgoto por baixo.
   - Descarregamento: Nós enviamos caminhões com braço munck ou guindaste telescópico para realizar o içamento e posicionamento exato nas bases pré-preparadas. O cliente precisa assegurar que o local comporta a entrada e raio de manobra do caminhão de transporte.

Seja sempre prestativo e, caso as dúvidas evoluão para intenção de compra, orçamento ou agendamento de visita técnica ao nosso pátio de fabricação, oriente-os orgulhosamente a utilizar nossos formulários do site ou preencher dados de contato na página para que entremos em contato!`;

    const response = await (async () => {
      const modelsToTry = ["gemini-3.5-flash", "gemini-3.1-flash-lite"];
      let lastError: any = null;

      for (const model of modelsToTry) {
        let attempts = 2;
        while (attempts > 0) {
          try {
            console.log(`Tentando gerar conteúdo com o modelo: ${model} (${attempts} tentativas restantes)`);
            const resContent = await ai.models.generateContent({
              model: model,
              contents,
              config: {
                systemInstruction,
                temperature: 0.7,
              },
            });
            return resContent;
          } catch (err: any) {
            lastError = err;
            const errMsg = err.message || JSON.stringify(err);
            console.warn(`Erro com o modelo ${model}: ${errMsg}`);
            attempts--;
            if (attempts > 0) {
              await new Promise((resolve) => setTimeout(resolve, 1000));
            }
          }
        }
      }
      throw lastError || new Error("Falha ao se comunicar com a Inteligência Artificial após múltiplas tentativas.");
    })();

    res.json({ text: response.text });
  } catch (err: any) {
    console.error("Erro na rota do Gemini:", err);
    res.status(500).json({ error: err.message || "Erro no processamento de inteligência artificial" });
  }
});


// Start Server helper + Vite setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
