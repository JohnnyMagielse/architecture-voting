<template>
  <div class="border-2 m-20 rounded-lg border-gray-100 shadow-sm" v-if="profile">
    <div class="p-20">
      <h1 class="font-bold text-2xl">Profile</h1>
    </div>

    <div class="flex gap-20 justify-center mb-40">
      <div class="w-1/3">
        <span class="font-bold">National ID Photo:</span>
        <img :src="profile.image_url" alt="" class="object-fit rounded-md shadow-md">
      </div>

      <div class="border-2 rounded-lg border-gray-100 shadow-sm w-1/2  p-10 mt-6">
        <h2 class="font-bold text-xl">Personal Information</h2>
        <div class="grid grid-cols-2">
          <div class="col-1 p-10 items-center">
            <p class="py-2 mb-4 border-b-2"><strong>Email:</strong> {{ profile.email }}</p>
            <p class="py-2 mb-4 border-b-2"><strong>First Name:</strong> {{ profile.first_name }}</p>
            <p class="py-2 mb-4 border-b-2"><strong>Last Name:</strong> {{ profile.last_name }}</p>
          </div>
          
          <div class="col-2 p-10">
            <p class="py-2 mb-4 border-b-2"><strong>Address:</strong> {{ profile.address }}</p>
            <p class="py-2 mb-4 border-b-2"><strong>Phone Number:</strong> {{ profile.phone_number }}</p>
            <p class="py-2 mb-4 border-b-2"><strong>Date of Birth:</strong> {{ profile.date_of_birth }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else>
    <p>Loading profile...</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      profile: null,
    };
  },
  mounted() {
    this.fetchProfile();
  },
  methods: {
    async fetchProfile() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('You are not logged in.');
        }
        const userEmail = JSON.parse(localStorage.getItem('user-email'));

        const response = await fetch(`http://localhost:3000/api/v1/users/profile?email=${userEmail}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        console.log('hrn', data);
        
        this.profile = data;
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    },
  },
};
</script>