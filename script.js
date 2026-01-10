document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("ticketForm");
  const ticketList = document.getElementById("ticketList");
  const filterPriority = document.getElementById("filterPriority");
  const filterStatus = document.getElementById("filterStatus");

  let tickets = JSON.parse(localStorage.getItem('tickets') || '[]');

  form.addEventListener("submit", function(e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const issue = document.getElementById("issue").value;
    const priority = document.getElementById("priority").value;
    const description = document.getElementById("description").value.trim();

    if (!name || !issue || !priority || !description) {
      alert("Please fill out all fields");
      return;
    }

    const ticket = {
      id: Date.now(),
      name,
      issue,
      priority,
      description,
      status: "Open"
    };

    tickets.push(ticket);
    saveTickets();
    form.reset();
    renderTickets();
  });

  function saveTickets() {
    localStorage.setItem('tickets', JSON.stringify(tickets));
  }

  function renderTickets() {
    ticketList.innerHTML = "";

    let filteredTickets = tickets.filter(ticket => {
      const priorityFilter = filterPriority.value;
      const statusFilter = filterStatus.value;

      return (priorityFilter === "All" || ticket.priority === priorityFilter) &&
             (statusFilter === "All" || ticket.status === statusFilter);
    });

    filteredTickets.forEach(ticket => {
      const div = document.createElement("div");
      div.classList.add("ticket");

      // Add priority class
      if (ticket.priority === "Low") div.classList.add("priority-low");
      if (ticket.priority === "Medium") div.classList.add("priority-medium");
      if (ticket.priority === "High") div.classList.add("priority-high");

      // Status badge
      let statusClass = ticket.status === "Open" ? "open" :
                        ticket.status === "In Progress" ? "inprogress" : "resolved";

      div.innerHTML = `
        <strong>${ticket.issue}</strong><br/>
        <em>${ticket.name}</em><br/>
        ${ticket.description}<br/>
        Status: <span class="status-badge ${statusClass}">${ticket.status}</span>
      `;

      const btnContainer = document.createElement("div");
      btnContainer.classList.add("buttons");

      const inProgressBtn = document.createElement("button");
      inProgressBtn.textContent = "In Progress";
      inProgressBtn.addEventListener("click", () => updateStatus(ticket.id, "In Progress"));

      const resolvedBtn = document.createElement("button");
      resolvedBtn.textContent = "Resolved";
      resolvedBtn.addEventListener("click", () => updateStatus(ticket.id, "Resolved"));

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.classList.add("delete");
      deleteBtn.addEventListener("click", () => deleteTicket(ticket.id));

      btnContainer.appendChild(inProgressBtn);
      btnContainer.appendChild(resolvedBtn);
      btnContainer.appendChild(deleteBtn);

      div.appendChild(btnContainer);
      ticketList.appendChild(div);
    });
  }

  function updateStatus(id, newStatus) {
    tickets = tickets.map(ticket =>
      ticket.id === id ? { ...ticket, status: newStatus } : ticket
    );
    saveTickets();
    renderTickets();
  }

  function deleteTicket(id) {
    tickets = tickets.filter(ticket => ticket.id !== id);
    saveTickets();
    renderTickets();
  }

  // Filters
  filterPriority.addEventListener("change", renderTickets);
  filterStatus.addEventListener("change", renderTickets);

  renderTickets();
});
