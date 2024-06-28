<template>
  <section class="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
    <div class="mx-auto max-w-screen-xl px-4 lg:px-12">
      <div>
        <div v-if="showVoteModal">
          <!-- Overlay -->
          <div class="overlay fixed inset-0 bg-black opacity-50 z-40"></div>

          <!-- Modal -->
          <div tabindex="-1" class="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto h-[calc(100%-1rem)] max-h-full flex items-center justify-center">
            <div class="relative w-full max-w-md max-h-full mx-auto">
              <!-- Modal content -->
              <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <!-- Modal header -->
                <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                  <h3 class="text-xl font-medium text-gray-900 dark:text-white">
                    {{ this.lastOpenedProposal.question }}
                  </h3>
                  <button @click="closeVoteModal" type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span class="sr-only">Close modal</span>
                  </button>
                </div>
                <!-- Modal body -->
                <div class="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                  <button v-if="this.lastOpenedProposal.voted === '-'" @click="votedYes(this.lastOpenedProposal)" type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Yes</button>
                  <button v-if="this.lastOpenedProposal.voted === '-'" @click="votedNo(this.lastOpenedProposal)" type="button" class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">No</button>
                  <div v-else>You have already voted on this proposal</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div v-for="proposal in proposals" :key="proposal.id" class="relative overflow-hidden bg-white shadow-md dark:bg-gray-700 dark:text-gray-400 md:rounded-lg mb-4">
            <div class="flex flex-col items-center justify-between p-4 space-y-3 md:flex-row md:space-y-0 md:space-x-4">
              <div class="fixed-position-31">
                {{ proposal.question }}
              </div>
              <div class="fixed-position-15">
                Start-date: {{ proposal.startDate }}
              </div>
              <div class="fixed-position-15">
                End-date: {{ proposal.endDate }}
              </div>
              <div class="fixed-position-15">
                Voted: {{ proposal.voted }}
              </div>
              <button @click="openVoteModal(proposal)" type="button" class="text-white flex items-center justify-center w-full px-4 py-2 text-sm font-medium rounded-lg md:w-auto bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 dark:bg-blue-700 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                Vote
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      lastOpenedProposal: null,
      showVoteModal: false,
      proposals: []
    };
  },

  mounted() {
    this.fetchProposals();
  },

  methods: {
    async fetchProposals() {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You are not logged in.');
      }

      const response = await fetch('http://localhost:3000/api/v1/votes/get', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        const electionData = responseData.message;

        if (electionData.question !== "") {
          this.proposals = [{
            id: 1,
            question: electionData.question,
            startDate: this.formatDateToDDMMYYYY(new Date(electionData.startDate)),
            endDate: this.formatDateToDDMMYYYY(new Date(electionData.endDate)),
            voted: "-"
          }];
        }

      } else {
        const errorData = await response.json();
        console.error('Request failed:', errorData);
      }
    },

    openVoteModal(proposal) {
      this.lastOpenedProposal = proposal;
      this.showVoteModal = true;
    },

    closeVoteModal() {
      this.showVoteModal = false;
    },

    votedYes(clickedProposal) {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You are not logged in.');
      }
      
      this.proposals.forEach(async proposal => {
        if (proposal.id === clickedProposal.id) {
          const response = await fetch('http://localhost:3000/api/v1/votes/vote', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              answer: 'yes'
            })
          });

          if (response.ok) {
            const responseData = await response.json();
            alert(responseData.message);
          }

          proposal.voted = "yes";
        }
      });
      this.closeVoteModal();
    },

    votedNo(clickedProposal) {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You are not logged in.');
      }

      this.proposals.forEach(async proposal => {
        if (proposal.id === clickedProposal.id) {
          const response = await fetch('http://localhost:3000/api/v1/votes/vote', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              answer: 'no'
            })
          });

          if (response.ok) {
            const responseData = await response.json();
            alert(responseData.message);
          }
    
          proposal.voted = "no";
        }
      });
      this.closeVoteModal();
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