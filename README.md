# Epidefy
Epidefy is a platform to detect and, in the future, hopefully predict epidemic outbreaks in the regions affected by natural disasters like floods. It uses IBM's state-of-the-art Watson Assistant API to build a chatbot that empathetically enquires about the user's health. Noticing any mention of symptoms that contribute to common epidemic diseases. E.g. Dengue symptoms during and after floods.

Epidefy also gives a friendly dashboard to the medical supervisor in the area. Giving them information that'll help them determine if an epidemic is imminent. This will help the rescue teams to take ample amount of first medical kits specific to the suspected disease.

Thus, we help 'Defy' Epidemics.

## Structure

Currently, the codebase consists of a basic Android app that helps the user chat with our custom-trained chatbot (IBM Watson Assistant). The data gathered from the chatbot is sent to *this* API, which stores it in the IBM Cloudant DB. It then offers a GET request to the Medical Supervisor's Dashboard to pull the data.
