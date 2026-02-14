const API_URL = "/api/reviews";
let selectedRating = 0;

/* ---------- STAR RATING ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const stars = document.querySelectorAll(".stars span");

  stars.forEach((star, index) => {
    star.addEventListener("click", () => {
      selectedRating = index + 1;
      stars.forEach((s, i) => {
        s.classList.toggle("active", i < selectedRating);
      });
    });
  });

  loadReviews();
});

/* ---------- ADD REVIEW ---------- */
async function addReview() {
  const name = document.getElementById("name").value.trim();
  const comment = document.getElementById("comment").value.trim();

  if (!name || !comment || selectedRating === 0) {
    alert("Fill all fields and select rating");
    return;
  }

  await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      rating: selectedRating,
      comment
    })
  });

  // Reset form
  document.getElementById("name").value = "";
  document.getElementById("comment").value = "";
  selectedRating = 0;
  document.querySelectorAll(".stars span").forEach(s =>
    s.classList.remove("active")
  );

  // SHOW THANK YOU PAGE
  const thankYou = document.getElementById("thankYouPage");
  thankYou.style.display = "flex";

  // HIDE AFTER 5 SECONDS
  setTimeout(() => {
    thankYou.style.display = "none";
  }, 5000);

  loadReviews();
}

/* ---------- LOAD REVIEWS ---------- */
async function loadReviews() {
  const res = await fetch(API);
  const data = await res.json();

  const reviews = document.getElementById("reviews");
  reviews.innerHTML = "";

  data.reverse().forEach(r => {
    const card = document.createElement("div");
    card.className = "review-card";

    card.innerHTML = `
      <h3>${r.name}</h3>
      <div class="review-stars">${"★".repeat(r.rating)}</div>
      <p>${r.comment}</p>

      <div class="actions">
        <button class="delete">Delete</button>
      </div>
    `;

    // ADMIN DELETE
    card.querySelector(".delete").addEventListener("click", () => {
      deleteReview(r._id, card);
    });

    reviews.appendChild(card);
  });
}

/* ---------- ADMIN DELETE ---------- */
async function deleteReview(id, card) {
  const adminKey = prompt("Enter Admin Key");

  if (!adminKey) return;

  // animation
  card.style.transform = "scale(0.9)";
  card.style.opacity = "0";

  setTimeout(async () => {
    const res = await fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: {
        "admin-key": adminKey
      }
    });

    const data = await res.json();

    if (res.ok) {
      loadReviews();
    } else {
      alert(data.message || "Unauthorized");
      card.style.opacity = "1";
      card.style.transform = "scale(1)";
    }
  }, 300);
}
