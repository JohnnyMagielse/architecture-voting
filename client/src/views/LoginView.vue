<template>
    <div class="flex gap-10 justify-center mt-10">
      <main class="w-1/3 px-20 py-16 ring-1 rounded-lg ring-gray-200 drop-shadow-sm">
        <button class="text-blue-400 text-sm" @click="handleBack">
          <font-awesome-icon icon="fa-solid fa-arrow-left" />
          Back
        </button>
        <h1 class="text-xl font-semibold mb-12 py-4 border-b-2 border-gray-200">User Login</h1>
        <form class="max-w-lg" @submit.prevent="handleLogin">
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
          <div class="text-right flex gap-3 items-center justify-between mt-10">
            <div>
              <span class="text-xs">You don't have an account? You can register from 
                <router-link to="/register" class="underline text-blue-500">here.</router-link>
              </span>
            </div>
            <div class="right">
              <ButtonAtom
                :text="'Login'"
                :backgroundColor="'bg-blue-500'"
                :disabled="!email || !password"
                :icon="'arrow-right'"
                @click="handleLogin"
              />
            </div>
          </div>
        </form>
      </main>
    </div>
  </template>
  
  <script>
  import ButtonAtom from '../components/atoms/ButtonAtom.vue';
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  export default {
    components: {
      ButtonAtom,
    },
    setup() {
      const email = ref('demo@hva.nl');
      const password = ref('password');
      const router = useRouter();
  
      const handleBack = () => {
        router.push('/');
      };
  
      const handleLogin = async () => {
        const userData = {
          email: email.value,
          password: password.value
        };
  
        try {
          const response = await fetch('http://localhost:3000/api/v1/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
          });
  
          if (response.ok) {
            const responseData = await response.json();
            alert('User login successful');    
            localStorage.setItem('token', responseData.token);
            localStorage.setItem('user-email', JSON.stringify(responseData.email));
            router.push('/');
          } else {
            const errorData = await response.json();
            console.error('Login failed:', errorData);
          }
        } catch (error) {
          console.error('An error occurred:', error);
        }
      };
  
      return {
        email,
        password,
        handleLogin,
        handleBack
      };
    }
  };
  </script>
  