import "./style.scss";
const basePath = "http://localhost:3000/boodschappen/";

async function main() {
  const listRef = document.querySelector("ul");
  const formRef = document.querySelector("form");
  const naamRef = document.querySelector("#naam");
  const prijsRef = document.querySelector("#prijs");
  const idRef = document.querySelector("#id");
  render(listRef);

  listRef.onclick = async (e) => {
    if (e.target.classList.contains("remove")) {
      const idToDelete = e.target.parentElement.dataset.id;
      const response = await fetch(basePath + idToDelete, {
        method: "DELETE",
      });
      await response.json();
      render(listRef);
    }
    if (e.target.classList.contains("edit")) {
      const idToUpdate = e.target.parentElement.dataset.id;
      document.querySelector("legend").innerText = "Wijzig product";
      document.querySelector("#submit").value = "wijzig";
      // eerste span selecteren kan om naam van product op te vragen
      // maar UI kan in toekomst wijzigen
      //e.target.parentElement.children[0]
      // ophalen van data op basis van id
      const response = await fetch(basePath + idToUpdate);
      const { naam, prijs, id } = await response.json();
      naamRef.value = naam;
      prijsRef.value = prijs;
      idRef.value = id;
    }
  };

  formRef.onsubmit = async (e) => {
    e.preventDefault();
    const naam = naamRef.value;
    const prijs = prijsRef.value;
    const id = idRef.value;
    const response = await fetch(basePath + id, {
      method: id ? "PUT" : "POST",
      body: JSON.stringify({
        naam,
        prijs,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    await response.json();
    document.querySelector("legend").innerText = "Nieuw product";
    document.querySelector("#submit").value = "voeg toe";
    naamRef.value = "";
    prijsRef.value = "";
    idRef.value = "";
    naamRef.focus();
    render(listRef);
  };
}

main();

async function render(listRef) {
  const response = await fetch(basePath);
  const data = await response.json();
  listRef.innerHTML = data
    .map(
      ({ id, naam, prijs }) => `
        <li data-id="${id}">
            <span>${naam}</span>&nbsp;&nbsp;-&nbsp;&nbsp;<em>${prijs}€</em>
            <button class="remove">wis</button>
            <button class="edit">wijzig</button>
        </li>
        `
    )
    .join("");
}
