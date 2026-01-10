document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("ticketForm");
  const ticketList = document.getElementById("ticketList");

  let tickets = [];

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
    form.reset();
    renderTickets();
  });

  function renderTickets() {
    ticketList.innerHTML = "";

    tickets.forEach(ticket => {
      const div = document.createElement("div");
      div.classList.add("ticket");

      // ✅ Add priority class
      if (ticket.priority === "Low") div.classList.add("priority-low");
      if (ticket.priority === "Medium") div.classList.add("priority-medium");
      if (ticket.priority === "High") div.classList.add("priority-high");

      div.innerHTML = `
        <strong>${ticket.issue}</strong><br/>
        <em>${ticket.name}</em><br/>
        ${ticket.description}<br/>
        Status: <span>${ticket.status}</span>
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
    renderTickets();
  }

  function deleteTicket(id) {
    tickets = tickets.filter(ticket => ticket.id !== id);
    renderTickets();
  }
});
