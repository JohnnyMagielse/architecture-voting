<template>
    <div class="flex gap-10 justify-center mt-10">
      <main class="w-1/3 px-20 py-16 ring-1 rounded-lg ring-gray-200 drop-shadow-sm">
        <button class="text-blue-400 text-sm" @click="handleBack">
            <font-awesome-icon icon="fa-solid fa-arrow-left" />
          Back
        </button>
        <h1 class="text-xl font-semibold mb-12 py-4 border-b-2 border-gray-200">User Registration</h1>
        <form class="max-w-lg" @submit.prevent="registerUser">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="email">Email:</label>
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-normal focus:outline-2 focus:shadow-outline"
              type="email"
              id="email"
              v-model="email"
              required
              autocomplete="email"
            />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="password">Password:</label>
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-normal focus:outline-2 focus:shadow-outline"
              type="password"
              id="password"
              v-model="password"
              required
              autocomplete="current-password"
            />
          </div>
          
            <div class="text-right flex gap-3 items-center justify-center my-10">
              <div>
                <span class="text-xs">You already have an account? You can login from 
                  <router-link to="/login" class="underline text-blue-500">here.</router-link>
                </span>
              </div>
            </div>
          
            <!-- Additional fields -->
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="firstName">First Name:</label>
              <input
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-normal focus:outline-2 focus:shadow-outline"
                type="text"
                id="firstName"
                v-model="firstName"
                required
              />
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="lastName">Last Name:</label>
              <input
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-normal focus:outline-2 focus:shadow-outline"
                type="text"
                id="lastName"
                v-model="lastName"
                required
              />
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="address">Address:</label>
              <input
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-normal focus:outline-2 focus:shadow-outline"
                type="text"
                id="address"
                v-model="address"
                required
              />
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="phoneNumber">Phone Number:</label>
              <input
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-normal focus:outline-2 focus:shadow-outline"
                type="tel"
                id="phoneNumber"
                v-model="phoneNumber"
                required
              />
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="dob">Date of Birth:</label>
              <input
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-normal focus:outline-2 focus:shadow-outline"
                type="date"
                id="dob"
                v-model="dob"
                required
              />
            </div>
            <div class="text-right float-right mt-10">
              <ButtonAtom
                :text="'Register'"
                :backgroundColor="'bg-blue-500'"
                @onClick="registerUser"
                :disabled="!email || !password || !firstName || !lastName || !address || !phoneNumber || !dob"
                :icon="'arrow-right'"
              />
            </div>
          
        </form>
      </main>
    </div>
  </template>
  
  
  <script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ButtonAtom from '../components/atoms/ButtonAtom.vue';

export default {
  components: {
    ButtonAtom
  },
  setup() {
    const email = ref('');
    const password = ref('');
    const firstName = ref('');
    const lastName = ref('');
    const address = ref('');
    const phoneNumber = ref('');
    const dob = ref('');
    const rewardRequested = ref(false);
    const showAdditionalFields = ref(false);
    const router = useRouter();

    const handleBack = () => {
      router.push('/');
    };

    const registerUser = async () => {
      const userData = {
        first_name: firstName.value,
        last_name: lastName.value,
        address: address.value,
        phone_number: phoneNumber.value,
        email: email.value,
        password: password.value,
        date_of_birth: dob.value,
        reward_requested: rewardRequested.value.toString()
      };

      try {
        const response = await fetch('/api/v1/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        });

        if (response.ok) {
          alert('User registration successful');
          router.push('/login');
        } else {
          const errorData = await response.json();
          console.error('Registration failed:', errorData);
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };

    return {
      email,
      password,
      firstName,
      lastName,
      address,
      phoneNumber,
      dob,
      rewardRequested,
      showAdditionalFields,
      handleBack,
      registerUser
    };
  }
};
</script>
