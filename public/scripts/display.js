getInquiries();

// retrieve inquiries from backend
function getInquiries() {
  fetch('https://warm-inlet-62149.herokuapp.com/inquiries')
    .then(response => response.json())
    .then(data => displayInquiries(data))
}

// create html for inquiries
function displayInquiries(inquiries) {
  inquiries.forEach(inquiry => {
    createInquiry(inquiry)
  });
}

// create individual inquiries and append to container
function createInquiry(inquiry) {
  const div = document.createElement("div");
  div.classList.add("inquiry-item");
  date = inquiry.timestamp.substring(0,10);
  time = inquiry.timestamp.substring(11, 19);
  div.innerHTML = `       
          <div class="listRow">
           <div class="label">Name</div>
           <div class="listName">${inquiry.name}</div>
           <div class="label">Email</div>
           <div class="listEmail">${inquiry.email}</div>
           <div class="label">Message</div>
           <div class="listMessage">${inquiry.message}</div>
           <div class="label">Newsletter subscription</div>
           <div class="listMessage">${inquiry.newsletter}</div>
           <div class="label">Submitted</div>
           <div class="listDate">${date + " " + time}</div>
           </div>
          `
  inquiryContainer = document.getElementById("inquiryContainer");;
  inquiryContainer.appendChild(div);
}