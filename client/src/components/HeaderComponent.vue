<template>
    <header class="">
        <div class="wrapper flex justify-between px-20 bg-sky-100 border-b-2 border-gray-100 gap-10 items-center h-24">
            <div class="logo">
                <img src="../assets//headerLogo.png" alt="" width="150">
            </div>
            <div class="flex items-center gap-20">
                <ButtonAtom 
                    :text="isAuthenticated ? 'Logout' : 'Sign In'" 
                    :backgroundColor="isAuthenticated ? 'bg-red-500' : 'bg-blue-500'" 
                    @click="isAuthenticated ? logout() : navigate('/login')" 
                />
            </div>
        </div>
        <SecondaryNav />
    </header>
</template>

<script>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import ButtonAtom from '../components/atoms/ButtonAtom.vue';
import SecondaryNav from '../components/SecondaryNav.vue';

export default {
    components: {
        ButtonAtom,
        SecondaryNav,
    },
    setup() {
        const router = useRouter();
        const isAuthenticated = ref(false);

        onMounted(() => {
            const token = localStorage.getItem('token');
            isAuthenticated.value = !!token;
        });

        const navigate = (route) => {
            router.push(route);
        };

        const logout = () => {
            localStorage.removeItem('token');
            isAuthenticated.value = false;
            location.reload();
        };

        return {
            navigate,
            logout,
            isAuthenticated,
        };
    },
};
</script>