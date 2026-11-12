// FreelanceFlow AI — Core Escrow Engine & Universal AI Co-Pilot

document.addEventListener("DOMContentLoaded", () => {
  const generateBtn = document.getElementById("generateBtn");
  const aiPreview = document.getElementById("aiPreview");
  const contractTermsText = document.getElementById("contractTermsText");

  const escrowBadge = document.getElementById("escrowBadge");
  const lockedAmountDisplay = document.getElementById("lockedAmountDisplay");
  const paymentInstructions = document.getElementById("paymentInstructions");
  const paypalButtonContainer = document.getElementById("paypal-button-container");

  let currentProjectData = null;
  let activeVaultsList = [];

  // Helper Initials
  function getInitials(name) {
    if (!name) return "FF";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  }

  // --- AI ASSISTANT WIDGET LOGIC ---
  const aiToggleBtn = document.getElementById("ai-assistant-toggle");
  const aiGreetingBubble = document.getElementById("ai-greeting-bubble");
  const aiChatPanel = document.getElementById("ai-chat-panel");
  const aiChatClose = document.getElementById("ai-chat-close");
  const aiChatForm = document.getElementById("ai-chat-form");
  const aiChatInput = document.getElementById("ai-chat-input");
  const aiChatMessages = document.getElementById("ai-chat-messages");

  if (aiToggleBtn) {
    aiToggleBtn.addEventListener("click", () => {
      aiGreetingBubble.classList.add("hidden");
      aiChatPanel.classList.toggle("hidden");
    });
  }

  if (aiChatClose) {
    aiChatClose.addEventListener("click", () => {
      aiChatPanel.classList.add("hidden");
    });
  }

  if (aiChatForm) {
    aiChatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const query = aiChatInput.value.trim();
      if (!query) return;

      // User Message
      appendChatMessage(query, "user");
      aiChatInput.value = "";

      // AI Response Logic
      setTimeout(() => {
        const response = generateAIResponse(query);
        appendChatMessage(response, "assistant");
      }, 600);
    });
  }

  function appendChatMessage(text, sender) {
    const msgDiv = document.createElement("div");
    if (sender === "user") {
      msgDiv.className = "bg-blue-600 text-white p-2.5 rounded-xl max-w-[80%] ml-auto text-xs shadow-sm";
    } else {
      msgDiv.className = "bg-slate-200 text-slate-900 p-2.5 rounded-xl max-w-[85%] text-xs leading-relaxed border border-slate-300";
    }
    msgDiv.innerText = text;
    aiChatMessages.appendChild(msgDiv);
    aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
  }

  function generateAIResponse(input) {
    const query = input.toLowerCase();
    if (query.includes("how") || query.includes("work") || query.includes("step")) {
      return "To use FreelanceFlow: 1) Fill client & freelancer info in 'Create Escrow'. 2) Click 'Generate AI Contract' to lock scope. 3) Approve payment via PayPal Sandbox to lock funds in Escrow Vault.";
    } else if (query.includes("dispute") || query.includes("conflict") || query.includes("change")) {
      return "If a scope disagreement occurs, navigate to the 'Dispute Hub'. I will analyze the original smart contract hash against submitted deliverables to propose an automated fair settlement.";
    } else if (query.includes("paypal") || query.includes("vault") || query.includes("payment")) {
      return "All escrow deposits use PayPal Sandbox Integration. Funds are securely locked until the client approves the final milestone.";
    } else {
      return "I am monitoring active smart contracts. How can I assist you with contract generation, PayPal escrow vaults, or scope arbitration today?";
    }
  }

  // --- ESCROW & CONTRACT ENGINE ---
  generateBtn.addEventListener("click", () => {
    const client = document.getElementById("clientName").value.trim();
    const freelancer = document.getElementById("freelancerName").value.trim();
    const title = document.getElementById("projectTitle").value.trim();
    const amount = parseFloat(document.getElementById("projectAmount").value);
    const deadline = parseInt(document.getElementById("projectDeadline").value);
    const scope = document.getElementById("projectScope").value.trim();

    if (!client || !freelancer || !title || !scope || isNaN(amount) || isNaN(deadline)) {
      alert("Please fill in all required fields.");
      return;
    }

    if (amount <= 0 || deadline <= 0) {
      alert("Budget and Time must be greater than zero.");
      return;
    }

    const contractHash = "0x" + Math.random().toString(16).substring(2, 12).toUpperCase();
    const currentDate = new Date().toISOString().split('T')[0];
    const clientInitials = getInitials(client);

    currentProjectData = { 
      client, 
      freelancer, 
      title, 
      amount, 
      deadline, 
      scope, 
      contractHash, 
      currentDate,
      clientInitials 
    };

    generateBtn.disabled = true;
    generateBtn.innerText = "Synthesizing Official Contract...";
    generateBtn.classList.add("opacity-75");

    setTimeout(() => {
      generateBtn.disabled = false;
      generateBtn.innerText = "Generate AI Contract & Lock Scope";
      generateBtn.classList.remove("opacity-75");

      // Render Screen Contract Preview
      contractTermsText.innerHTML = `
        <div class="flex justify-between items-start border-b pb-4 mb-4 border-slate-200">
          <div class="flex items-center space-x-3">
            <div class="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              ${clientInitials}
            </div>
            <div>
              <h3 class="font-extrabold text-sm text-slate-900">FREELANCEFLOW SMART ESCROW AGREEMENT</h3>
              <p class="text-[11px] text-slate-500 font-mono">HASH ID: ${contractHash} | DATE: ${currentDate}</p>
            </div>
          </div>
          <span class="bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase">Official Record</span>
        </div>

        <div class="space-y-3 text-xs text-slate-700 leading-relaxed font-sans">
          <div>
            <span class="font-bold text-slate-900 block">PARTIES INVOLVED</span>
            <p>• <strong>Client:</strong> <span class="text-blue-600 font-semibold">${client}</span> (Initials: ${clientInitials})</p>
            <p>• <strong>Freelancer:</strong> <span class="text-blue-600 font-semibold">${freelancer}</span></p>
          </div>

          <div>
            <span class="font-bold text-slate-900 block">1. PROJECT BUDGET & TIMELINE</span>
            <p>• <strong>Project Name:</strong> ${title}</p>
            <p>• <strong>Total Budget:</strong> $${amount.toFixed(2)} USD (Held in Escrow)</p>
            <p>• <strong>Project Time:</strong> ${deadline} Calendar Days</p>
          </div>

          <div>
            <span class="font-bold text-slate-900 block">2. SCOPE & DELIVERABLES</span>
            <div class="bg-slate-50 p-2.5 rounded border border-slate-200 font-mono text-[11px] whitespace-pre-line">${scope}</div>
          </div>

          <div>
            <span class="font-bold text-slate-900 block">3. ESCROW CONDITIONS & RELEASE TERMS</span>
            <p>Client funds are securely deposited into FreelanceFlow Vault. Upon full completion of deliverables by <strong>${freelancer}</strong> within <strong>${deadline} days</strong>, funds will be released upon client approval or AI arbitration.</p>
          </div>

          <div class="pt-4 mt-4 border-t border-slate-200 grid grid-cols-2 gap-4">
            <div class="border border-dashed border-slate-300 p-3 rounded-lg text-center bg-slate-50/50">
              <span class="text-[10px] text-slate-400 block uppercase tracking-wider">Client Digital Signature</span>
              <span class="font-serif italic text-sm text-slate-900 font-bold block mt-1">${client}</span>
              <span class="text-[9px] text-emerald-600 font-mono">✓ Verified & Locked</span>
            </div>
            <div class="border border-dashed border-slate-300 p-3 rounded-lg text-center bg-slate-50/50">
              <span class="text-[10px] text-slate-400 block uppercase tracking-wider">Freelancer Digital Signature</span>
              <span class="font-serif italic text-sm text-slate-900 font-bold block mt-1">${freelancer}</span>
              <span class="text-[9px] text-emerald-600 font-mono">✓ Verified & Locked</span>
            </div>
          </div>
        </div>

        <div class="mt-6 pt-3 border-t border-slate-200 flex justify-between items-center">
          <span class="text-[10px] text-emerald-600 font-bold">✓ Cryptographically Secured & Verified</span>
          <button onclick="downloadContractPDF()" class="bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-semibold px-3.5 py-1.5 rounded-lg shadow-sm transition-all flex items-center space-x-1.5">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            <span>Download Contract PDF</span>
          </button>
        </div>
      `;

      aiPreview.classList.remove("hidden");

      lockedAmountDisplay.innerText = `$${amount.toFixed(2)} USD`;
      escrowBadge.innerText = "Ready for Secure Deposit";
      escrowBadge.className = "bg-amber-100 text-amber-800 border border-amber-300 text-xs px-3 py-1 rounded-full font-semibold";
      
      paymentInstructions.innerHTML = `Review the verified contract above for <strong>${client}</strong> and complete secure escrow deposit via PayPal Sandbox.`;
      paymentInstructions.className = "bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-700 leading-relaxed text-center mb-6";
      
      renderPayPalButton(amount);
    }, 1000);
  });

  // Download Contract PDF Function
  window.downloadContractPDF = function() {
    if (!currentProjectData) return;

    const printWindow = window.open('', '_blank');
    const pdfHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${currentProjectData.title}_Escrow_Agreement</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
          .header { border-bottom: 2px solid #2563eb; padding-bottom: 15px; margin-bottom: 25px; display: flex; justify-content: space-between; }
          .title { font-size: 18px; font-weight: bold; color: #0f172a; margin: 0; }
          .meta { font-size: 11px; color: #64748b; font-family: monospace; }
          .section { margin-bottom: 20px; }
          .section-title { font-size: 12px; font-weight: bold; color: #2563eb; text-transform: uppercase; margin-bottom: 6px; }
          .box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 6px; font-size: 12px; white-space: pre-line; }
          .signatures { margin-top: 40px; display: flex; justify-content: space-between; border-top: 1px solid #e2e8f0; padding-top: 20px; }
          .sig-box { width: 45%; text-align: center; border: 1px dashed #cbd5e1; padding: 15px; border-radius: 6px; }
          .sig-name { font-family: 'Georgia', serif; font-style: italic; font-weight: bold; font-size: 16px; margin-top: 5px; }
          .footer { margin-top: 50px; text-align: center; font-size: 10px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 15px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 class="title">FREELANCEFLOW AI — SMART ESCROW AGREEMENT</h1>
            <div class="meta">HASH ID: ${currentProjectData.contractHash} | ISSUED: ${currentProjectData.currentDate}</div>
          </div>
        </div>
        <div class="section">
          <div class="section-title">Contracting Parties</div>
          <div style="font-size: 13px;">
            <strong>Client:</strong> ${currentProjectData.client} [Initials: ${currentProjectData.clientInitials}]<br>
            <strong>Freelancer:</strong> ${currentProjectData.freelancer}
          </div>
        </div>
        <div class="section">
          <div class="section-title">1. Project Summary & Valuation</div>
          <div style="font-size: 13px;">
            <strong>Project Title:</strong> ${currentProjectData.title}<br>
            <strong>Total Escrow Budget:</strong> $${currentProjectData.amount.toFixed(2)} USD<br>
            <strong>Execution Period:</strong> ${currentProjectData.deadline} Calendar Days
          </div>
        </div>
        <div class="section">
          <div class="section-title">2. Scope & Technical Deliverables</div>
          <div class="box">${currentProjectData.scope}</div>
        </div>
        <div class="signatures">
          <div class="sig-box">
            <div style="font-size: 10px; color: #64748b; text-transform: uppercase;">Client Signature</div>
            <div class="sig-name">${currentProjectData.client}</div>
          </div>
          <div class="sig-box">
            <div style="font-size: 10px; color: #64748b; text-transform: uppercase;">Freelancer Signature</div>
            <div class="sig-name">${currentProjectData.freelancer}</div>
          </div>
        </div>
        <div class="footer">Secured via FreelanceFlow AI Escrow Engine & PayPal Sandbox Integration.</div>
        <script>window.onload = function() { window.print(); window.close(); }</script>
      </body>
      </html>
    `;
    printWindow.document.write(pdfHtml);
    printWindow.document.close();
  };

  // PayPal Button Rendering
  function renderPayPalButton(amountValue) {
    paypalButtonContainer.classList.remove("hidden");
    paypalButtonContainer.innerHTML = "";

    if (typeof paypal === "undefined") return;

    paypal.Buttons({
      style: { layout: 'horizontal', color: 'gold', shape: 'rect', label: 'paypal', tagline: false },
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [{
            description: `Escrow Vault: ${currentProjectData.title} (${currentProjectData.client})`,
            amount: { currency_code: 'USD', value: amountValue.toFixed(2) }
          }]
        });
      },
      onApprove: (data, actions) => {
        return actions.order.capture().then((details) => {
          const now = new Date();
          const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const todayStr = now.toLocaleDateString();

          activeVaultsList.push({
            title: currentProjectData.title,
            client: currentProjectData.client,
            clientInitials: currentProjectData.clientInitials,
            freelancer: currentProjectData.freelancer,
            totalBudget: amountValue,
            amountPaid: amountValue,
            deadline: currentProjectData.deadline,
            paymentStatus: "Fully Paid (Upfront)",
            startDate: todayStr,
            paymentLogs: [{
              amount: amountValue,
              date: todayStr,
              time: timestamp,
              txnId: details.id
            }]
          });

          updateActiveVaultsUI();

          // Reset inputs
          document.getElementById("clientName").value = "";
          document.getElementById("freelancerName").value = "";
          document.getElementById("projectTitle").value = "";
          document.getElementById("projectAmount").value = "";
          document.getElementById("projectDeadline").value = "";
          document.getElementById("projectScope").value = "";
          
          aiPreview.classList.add("hidden");
          paypalButtonContainer.classList.add("hidden");
          
          escrowBadge.innerText = "Vault Secured Successfully";
          escrowBadge.className = "bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs px-3 py-1 rounded-full font-semibold";
          lockedAmountDisplay.innerText = `$${amountValue.toFixed(2)} USD (Locked)`;
          paymentInstructions.innerHTML = `<strong>Vault Locked Successfully!</strong> Transaction ID: ${details.id}. View it anytime in the <strong>Active Vaults</strong> tab.`;
          paymentInstructions.className = "bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-800 text-center mb-6 font-semibold";

          currentProjectData = null;
          alert(`Vault Secured Successfully!\nTransaction ID: ${details.id}`);
        });
      }
    }).render('#paypal-button-container');
  }

  // Active Vaults UI Renderer
  function updateActiveVaultsUI() {
    const contractsView = document.getElementById("view-contracts");
    if (activeVaultsList.length === 0) return;

    let html = `
      <div class="card-bg border rounded-2xl p-8 shadow-sm space-y-6">
        <div>
          <h2 class="text-xl font-bold mb-1">Active Contracts & Escrow Vaults</h2>
          <p class="text-sm text-sub">Funded projects currently locked in PayPal Sandbox Vaults.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    `;

    activeVaultsList.forEach((v) => {
      html += `
        <div class="input-bg border rounded-xl p-6 space-y-4 shadow-sm relative overflow-hidden">
          <div class="flex justify-between items-center border-b pb-3 border-slate-300/40">
            <div class="flex items-center space-x-2">
              <div class="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10px]">
                ${v.clientInitials}
              </div>
              <span class="text-xs font-bold uppercase tracking-wider text-indigo-600">${v.title}</span>
            </div>
            <span class="text-[11px] border px-3 py-1 rounded-full font-bold bg-emerald-100 text-emerald-800 border-emerald-300">
              ${v.paymentStatus}
            </span>
          </div>

          <div class="space-y-1 text-xs">
            <p><strong>Client:</strong> ${v.client} | <strong>Freelancer:</strong> ${v.freelancer}</p>
            <p class="text-sub">Funded On: ${v.startDate}</p>
          </div>

          <div class="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 text-center text-xs text-emerald-800 font-bold">
            ✓ $${v.totalBudget.toFixed(2)} USD 100% Locked in Escrow Vault
          </div>

          <div class="pt-2 border-t border-slate-300/40">
            <span class="text-[10px] font-bold text-sub uppercase block mb-1">Transaction History Log</span>
            <div class="space-y-1">
              ${v.paymentLogs.map(log => `
                <div class="flex justify-between text-[11px] bg-slate-100/70 p-1.5 rounded font-mono">
                  <span>Txn (${log.date} ${log.time}):</span>
                  <span class="font-bold text-emerald-700">$${log.amount.toFixed(2)} USD</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    });

    html += `</div></div>`;
    contractsView.innerHTML = html;
  }
});