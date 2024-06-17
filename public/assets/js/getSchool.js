document.addEventListener('DOMContentLoaded', function() {
    axios.get('http://localhost:3000/api/school/getAllSchools')
      .then(response => {
        const schools = response.data.schools;
        const selectElement = document.getElementById('school');
        schools.forEach(school => {
          const option = document.createElement('option');
          option.value = school.id; 
          option.textContent = school.name; 
          selectElement.appendChild(option); 
        });
      })
      .catch(error => {
        console.error('Error al obtener las escuelas:', error);
      });
  });

  