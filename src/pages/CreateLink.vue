<template>
    <div v-if="errorMessage"
        class="absolute top-1/2 min-w-full bg-wos-950 border-wos-800 border-b-2 border-t-2 text-xs text-wos-50 text-center p-2 animate-wiggle z-50">
        {{ errorMessage }}</div>
    <div class="flex flex-col items-center gap-4" v-if="!generatedLink">
        <h1 class="font-normal">{{ name ? name : 'WOS Scheduler' }}</h1>
        <div class="rounded-3xl bg-wos-800 px-8 py-8 w-full flex flex-col gap-4">
            <p class="text-wos-700 font-wos text-xs text-center">Welcome, President! To create a new scheduling link,
                simply enter a unique name for it. Then, select the specific month and day for both the Minister of
                Education
                and the Vice President slots. Click 'Create Link' to generate your custom URL and a secure access key.
                Remember
                to save your access key – it's essential for managing player sign-ups later!</p>
            <div class="py-4 flex flex-col gap-4">
                <div class="flex flex-col gap-1">
                    <label class="text-xs" for="educationDay">Choose day of Minister Education</label>
                    <input id="educationDay" type="date" v-model="educationDay"
                        class="rounded-xl bg-wos-500 px-4 py-2 w-full text-wos-900 text-sm" />
                </div>
                <div class="flex flex-col gap-1">
                    <label class="text-xs" for="vicePresidentDay">Choose day of Vice President</label>
                    <input id="vicePresidentDay" type="date" v-model="vicePresidentDay"
                        class="rounded-xl bg-wos-500 px-4 py-2 w-full text-wos-900 text-sm" />
                </div>
                <div class="flex flex-col gap-1">
                    <label class="text-xs" for="linkTitle">Title for the link</label>
                    <input id="linkTitle" type="text" v-model="name"
                        class="rounded-xl bg-wos-500 px-4 py-2 w-full text-wos-900 text-sm" maxlength="20" />
                </div>
            </div>

            <div class="flex justify-center">
                <button @click="createLink" :disabled="loading"
                    class="rounded-2xl border-b-3 hover:cursor-pointer hover:from-wosbutton-yh50  hover:to-wosbutton-yh100 border-wosbutton-yb bg-linear-to-t from-wosbutton-y50 to-wosbutton-y100 shadow-md inset-shadow-sm inset-shadow-white/60 px-9 py-2.5 text-wosbutton-yb w-fit">
                    <template v-if="loading">
                        Creating...
                    </template>
                    <template v-else>
                        Create link
                    </template>
                </button>
            </div>
        </div>

    </div>
    <div class="flex flex-col text-center gap-4" v-if="generatedLink">
        <h1 class="font-normal">{{ name ? name : 'WOS Scheduler' }}</h1>
        <div class="rounded-3xl bg-wos-800 px-8 py-8 w-full flex flex-col justify-center items-center gap-4">
            <p class="text-wos-700 font-wos text-xs text-center">Remember to save your access key – it's essential for
                managing player sign-ups later! Keep this key safe.</p>
            <p class="text-wos-500 bg-wos-900 py-1 px-3 text-xs rounded-md">{{ newAccessKey }}</p>
            <button @click="copyToClipboard(newAccessKey)"
                class="rounded-2xl border-b-3 hover:cursor-pointer hover:from-wosbutton-bh50  hover:to-wosbutton-bh100 border-wosbutton-bb bg-linear-to-t from-wosbutton-b50 to-wosbutton-b100 shadow-md inset-shadow-sm inset-shadow-white/60 px-9 py-2.5 text-white w-fit">
                <span>Copy key</span>
            </button>
        </div>
        <div class="rounded-3xl bg-wos-800 px-8 py-8 w-full flex flex-col justify-center items-center gap-4">
            <p class="text-wos-700 font-wos text-xs text-center">Your link</p>
            <p class="text-wos-500 bg-wos-900 py-1 px-3 text-xs rounded-md truncate">{{ generatedLink }}</p>
            <div class="flex gap-2">
                <button @click="copyToClipboard(generatedLink)"
                    class="rounded-2xl border-b-3 hover:cursor-pointer hover:from-wosbutton-bh50  hover:to-wosbutton-bh100 border-wosbutton-bb bg-linear-to-t from-wosbutton-b50 to-wosbutton-b100 shadow-md inset-shadow-sm inset-shadow-white/60 px-9 py-2.5 text-white w-fit">
                    <span>Copy link</span>
                </button>

                <router-link :to="generatedLink"
                    class="rounded-2xl border-b-3 hover:cursor-pointer hover:from-wosbutton-bh50  hover:to-wosbutton-bh100 border-wosbutton-bb bg-linear-to-t from-wosbutton-b50 to-wosbutton-b100 shadow-md inset-shadow-sm inset-shadow-white/60 px-9 py-2.5 text-white w-fit">
                    <span>Access link</span>
                </router-link>
            </div>
        </div>
    </div>
    <p class="text-wos-700 font-wos font-light text-[0.675em] text-center">
        This project was developed by the ᴹᴬᴺᴱᴿᴼ of the state 1898 to help presidents organize the schedules of each
        player during the preparation of the SvS
    </p>
</template>

<script setup>
import { ref } from 'vue';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';


const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const name = ref('');
const educationDay = ref('');
const vicePresidentDay = ref('');
const loading = ref(false);
const generatedLink = ref('');
const newAccessKey = ref('');

const errorMessage = ref('');
const successMessage = ref('');

const createLink = async () => {
    errorMessage.value = '';
    successMessage.value = '';
    loading.value = true;

    const customLinkId = uuidv4();
    const generatedAccessKey = uuidv4();

    // Adicionar validação para as novas datas
    if (!educationDay.value || !vicePresidentDay.value) {
        errorMessage.value = 'Please select the day and month for both ministries.';
        setTimeout(() => errorMessage.value = '', 3000);
        loading.value = false;
        return;
    }

    try {
        const { data, error } = await supabase
            .from('links')
            .insert({
                id: customLinkId, // Use the new custom ID here
                name: name.value,
                access_key: generatedAccessKey,
                education_date: educationDay.value,
                vice_president_date: vicePresidentDay.value
            })
            .select()
            .single();

        if (error) {
            if (error.code === '23505') { // Unique violation error code
                errorMessage.value = 'A link with a very similar ID already exists. Please try again or slightly modify the name.';
                setTimeout(() => errorMessage.value = '', 3000);
                loading.value = false;
                return;
            }
            throw error;
        }
        newAccessKey.value = data.access_key;
        generatedLink.value = `${window.location}link/${data.id}`;
        successMessage.value = 'Link created successfully!';
        setTimeout(() => successMessage.value = '', 3000);

    } catch (error) {
        console.error('Error creating link:', error);
        errorMessage.value = `Error creating link: ${error.message}`;
        setTimeout(() => errorMessage.value = '', 3000);
    } finally {
        loading.value = false;
    }
};

const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
        successMessage.value = 'Copied to clipboard!';
        setTimeout(() => successMessage.value = '', 3000);
    }).catch(err => {
        errorMessage.value = 'Failed to copy.';
        setTimeout(() => errorMessage.value = '', 3000);
        console.error('Could not copy text: ', err);
    });
};

</script>
