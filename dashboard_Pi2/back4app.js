Parse.initialize('jFc8weoj0ooJf9ImqkiTjVg8bkJ1FfPS9nBPjUHS', '1jzfDQ7nCu6UgkoBAwUpqQ3mpg8hpEL5t6auoAAZ');
    Parse.serverURL = 'https://parseapi.back4app.com';

    async function fetchDataAndDisplay() {
        const TestObject = Parse.Object.extend('censo_inep_2023');
        const query = new Parse.Query(TestObject);
        try {
            const results = await query.find();

            // Manipular os dados obtidos
            const quantidadeEscolas = results.length;
            const quantidadeComEnergia = results.filter(result => result.get('IN_ENERGIA_REDE_PUBLICA') === 1).length;
            const quantidadeComAgua = results.filter(result => result.get('IN_AGUA_REDE_PUBLICA') === 1).length;
            const quantidadeComEsgoto = results.filter(result => result.get('IN_ESGOTO_REDE_PUBLICA') === 1).length;

            // Atualizar dados no dashboard
            document.getElementById('dado1').textContent = `Quantidade de Escolas: ${quantidadeEscolas}`;
            document.getElementById('dado2').textContent = `Quantidade com energia: ${quantidadeComEnergia}`;
            document.getElementById('dado3').textContent = `Quantidade com água: ${quantidadeComAgua}`;
            document.getElementById('dado4').textContent = `Quantidade de escolas com esgoto: ${quantidadeComEsgoto}`;

            // Dados para os gráficos
            var data1 = {
                labels: ['Com água', 'Sem água'],
                datasets: [{
                    data: [quantidadeComAgua, quantidadeEscolas - quantidadeComAgua],
                    backgroundColor: ['blue', 'red']
                }]
            };

            var data2 = {
                labels: ['Com energia', 'Sem energia'],
                datasets: [{
                    data: [quantidadeComEnergia, quantidadeEscolas - quantidadeComEnergia],
                    backgroundColor: ['green', 'purple']
                }]
            };

            var data3 = {
                labels: ['Com esgoto', 'Sem esgoto'],
                datasets: [{
                    data: [quantidadeComEsgoto, quantidadeEscolas - quantidadeComEsgoto],
                    backgroundColor: ['gray', 'brown']
                }]
            };
             const ctx = document.getElementById('chart4');

                new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Particular', 'Federal', 'Estadual', 'Pública'],
                    datasets: [{
                    label: 'Tipo de dependência',
                    borderWidth: 5
                    }]
                },
                options: {
                    scales: {
                    y: {
                        beginAtZero: true
                    }
                    }
                }
                });

            // Atualizar gráficos
            var options = {
                responsive: true,
                maintainAspectRatio: false
            };

            var ctx1 = document.getElementById('chart1').getContext('2d');
            var chart1 = new Chart(ctx1, {
                type: 'pie',
                data: data1,
                options: options
            });

            var ctx2 = document.getElementById('chart2').getContext('2d');
            var chart2 = new Chart(ctx2, {
                type: 'pie',
                data: data2,
                options: options
            });

            var ctx3 = document.getElementById('chart3').getContext('2d');
            var chart3 = new Chart(ctx3, {
                type: 'pie',
                data: data3,
                options: options
            });

            var ctx3 = document.getElementById('chart3').getContext('2d');
            var chart3 = new Chart(ctx3, {
                type: 'pie',
                data: data3,
                options: options
            });

            async function prepareChartData(className) {
                try {
                  const allData = await fetchAllData(className);
            
                  const dependencyTypeCounts = allData.reduce((acc, item) => {
                    const type = item.get('tipoDependencia'); 
                    acc[type] = (acc[type] || 0) + 1;
                    return acc;
                  }, {});
              
                  return {
                    labels: Object.keys(dependencyTypeCounts),
                    data: Object.values(dependencyTypeCounts),
                  };
                } catch (error) {
                  console.error('Error while preparing chart data:', error);
                }
              }
              
              // Função para renderizar o gráfico
              async function renderChart(chartId, className) {
                const ctx = document.getElementById(chartId);
                if (!ctx) {
                  console.error('Chart element not found');
                  return;
                }
                
                const chartData = await prepareChartData(className);
                
                if (chartData) {
                  new Chart(ctx, {
                    type: 'bar',
                    data: {
                      labels: chartData.labels,
                      datasets: [] [{
                        label: 'Tipo de dependência',
                        data: chartData.data,
                        borderWidth: 5
                      }]
                    },
                    options: {
                      scales: {
                        y: {
                          beginAtZero: true
                        }
                      }
                    }
                  });
                }
              }
              
              // Inicializa o gráfico após o carregamento da página
              document.addEventListener('DOMContentLoaded', () => {
                renderChart('chart4', 'censo_inep_2023'); 
              });


        } catch (error) {
            console.error('Erro ao buscar dados: ', error);
        }
    }

    window.onload = fetchDataAndDisplay;

    async function fetchAllData(className) {
        const query = new Parse.Query(className);
        let allResults = [];
        let limit = 300;
        let skip = 0;
      
        while(allResults.length < 300) {
          query.limit(limit);
          query.skip(skip);
      
          try {
            const results = await query.find();
            if (results.length === 0) {
              break;
            }
      
            allResults = allResults.concat(results);
            skip += limit;
          } catch (error) {
            console.error('Error while fetching data:', error);
            break;
          }
        }
      
        return allResults;
      }
      
      // Uso da função
      fetchAllData('censo_inep_2023').then(allData => {
        console.log('Total de dados recuperados:', allData.length);
        console.log(allData);
      }).catch(error => {
        console.error('Erro ao buscar dados:', error);
      });
