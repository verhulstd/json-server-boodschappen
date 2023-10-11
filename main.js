import "./style.scss";
const basePath = "http://localhost:3000/boodschappen/";

async function main() {
  const listRef = document.querySelector("ul");
  const formRef = document.querySelector("form");
  render(listRef);

  listRef.onclick = async (e) => {
    if (e.target.classList.contains("remove")) {
      console.log("wis");
      const idToDelete = e.target.parentElement.dataset.id;
      const response = await fetch(basePath + idToDelete, {
        method: "DELETE",
      });
      await response.json();
      render(listRef);
    }
  };

  formRef.onsubmit = async (e) => {
    e.preventDefault();
    const naam = document.querySelector("#naam").value;
    const prijs = document.querySelector("#prijs").value;
    const response = await fetch(basePath, {
      method: "POST",
      body: JSON.stringify({
        naam,
        prijs,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    await response.json();
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
            <span>${naam}</span> - <em>${prijs}€</em>
            <button class="remove">wis</button>
        </li>
        `
    )
    .join("");
}
