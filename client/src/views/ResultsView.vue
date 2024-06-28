<template>
    <section class="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
      <div class="mx-auto max-w-screen-xl px-4 lg:px-12">
        <!-- Start coding here -->
        <div class="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" class="px-4 py-3">Proposal</th>
                  <th scope="col" class="px-4 py-3">Start date</th>
                  <th scope="col" class="px-4 py-3">End date</th>
                  <th scope="col" class="px-4 py-3">Percentage yes</th>
                  <th scope="col" class="px-4 py-3">Percentage no</th>
                  <th scope="col" class="pl-4 py-3">Total amount of votes</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="result in results" :key="result.id" class="border-b dark:border-gray-700">
                  <th scope="row" class="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">{{ result.question }}</th>
                  <td class="px-4 py-3">{{ result.startDate }}</td>
                  <td class="px-4 py-3">{{ result.endDate }}</td>
                  <td class="px-4 py-3">{{ result.percentageVotesYes }}%</td>
                  <td class="px-4 py-3">{{ result.percentageVotesNo }}%</td>
                  <td class="px-4 py-3">{{ result.totalVotes }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script>
  export default {
    data() {
      return {
        results: []
      };
    },
  
    mounted() {
      this.fetchAllResults();
    },
  
    methods: {
      async fetchAllResults() {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('You are not logged in.');
        }

        const response = await fetch('http://localhost:3000/api/v1/votes/results', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        if (response.ok) {
          const responseData = await response.json();

          const calculatedPercentages = this.calculateTotalVotesPlusPercentageOfVotes(responseData.yes, responseData.no);
          this.results.push({
            id: 1,
            question: responseData.question,
            totalVotes: calculatedPercentages.totalNumberOfVotes,
            percentageVotesYes: calculatedPercentages.percentageVotesYes.toFixed(2),
            percentageVotesNo: calculatedPercentages.percentageVotesNo.toFixed(2),
            startDate: this.formatDateToDDMMYYYY(new Date(responseData.startDate)),
            endDate: this.formatDateToDDMMYYYY(new Date(responseData.endDate)),
          });
        } else {
          const errorData = await response.json();
          console.error('Request failed:', errorData);
        }
      },
  
      calculateTotalVotesPlusPercentageOfVotes(votesYes, votesNo) {
        const totalVotes = votesYes + votesNo;
  
        if (totalVotes === 0) {
          return {
            totalNumberOfVotes: 0,
            percentageVotesYes: 0,
            percentageVotesNo: 0
          };
        }
  
        const percentageVotesYes = (votesYes / totalVotes) * 100;
        const percentageVotesNo = (votesNo / totalVotes) * 100;
  
        return {
          totalNumberOfVotes: totalVotes,
          percentageVotesYes: percentageVotesYes,
          percentageVotesNo: percentageVotesNo  
        };
      },
  
      formatDateToDDMMYYYY(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
  
        return `${day}/${month}/${year}`;
      }
    }
  };
  </script>
  
  <style>
  .fixed-position-15 {
    min-width: 15%;
    text-align: left;
    padding: 0.5rem;
  }
  
  .fixed-position-31 {
    min-width: 41%;
    text-align: left;
    padding: 0.5rem;
  }
  
  .overlay {
    background: rgba(0, 0, 0, 0.7);
  }
  </style>