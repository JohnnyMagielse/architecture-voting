<template>
    <div class="navbar text-blue-400 border-b-2 drop-shadow-sm text-sm">
        <nav class="flex justify-center gap-20 flex-grow">
            <router-link
                to="/"
                :class=aClass
            >
            <font-awesome-icon icon="fa-solid fa-house" class="mr-1"/>
                Homepage
            </router-link>
            <router-link
                to="/elections"
                :class=aClass
            >
            <font-awesome-icon icon="fa-solid fa-check-to-slot" class="mr-1"/>
                Elections
            </router-link>
            <router-link
                to="/results"
                :class=aClass
            >
            <font-awesome-icon icon="fa-solid fa-square-poll-horizontal" class="mr-1"/>
                Results
            </router-link>
            <router-link
                to="/profile"
                :class=aClass
            >
            <font-awesome-icon icon="fa-solid fa-user" class="mr-1"/>
                Profile
            </router-link>
        </nav>
    </div>
</template>

<script>
export default {
    data() {
        return {
            aClass: 'text-sky-900 border-b-4 py-4 border-transparent hover:text-blue-700 hover:border-blue-700',
            activeClass: 'border-b-4 py-4 text-blue-700 border-blue-700',
        };
    },
};
</script>