<template>
    <div v-if="errorMessage"
        class="absolute top-1/2 min-w-full bg-wos-950 border-wos-800 border-b-2 border-t-2 text-xs text-wos-50 text-center p-2 animate-wiggle z-50">
        {{ errorMessage }}</div>
    <div v-if="showSignupModal"
        class="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-40">
        <div class="bg-wos-800 p-6 rounded-xl w-80 max-w-full flex flex-col gap-4">
            <h2 class="text-wos-50 text-center">Your ID Player</h2>
            <div class="flex flex-col gap-1">
                <input type="text" v-model="modalPlayerId"
                    class="rounded-xl bg-wos-500 px-4 py-2 w-full text-wos-900 text-sm" maxlength="20" />
            </div>
            <div class="flex justify-center gap-4">
                <button @click="closeSignupModal"
                    class="rounded-2xl border-b-3 hover:cursor-pointer hover:from-wosbutton-bh50  hover:to-wosbutton-bh100 border-wosbutton-bb bg-linear-to-t from-wosbutton-b50 to-wosbutton-b100 shadow-md inset-shadow-sm inset-shadow-white/60 px-9 py-2.5 text-white w-fit">
                    <span>Cancel</span>
                </button>
                <button @click="confirmSignup"
                    class="rounded-2xl border-b-3 hover:cursor-pointer hover:from-wosbutton-yh50  hover:to-wosbutton-yh100 border-wosbutton-yb bg-linear-to-t from-wosbutton-y50 to-wosbutton-y100 shadow-md inset-shadow-sm inset-shadow-white/60 px-9 py-2.5 text-wosbutton-yb w-fit">
                    Confirm
                </button>
            </div>
        </div>
    </div>
    <div class="p-3 flex flex-col gap-4">
        <div class="flex flex-col items-center gap-4">
            <h1 class="font-normal">{{ linkData ? linkData.name : 'WOS Scheduler' }}</h1>
        </div>
        <div class="flex gap-2 items-center justify-center -mb-5">
            <button v-for="tab in tabs" :key="tab.value" @click="currentMenu = tab.value"
                class="rounded-t-xl text-xs p-4 w-fit hover:bg-wos-500 hover:text-wos-800 hover:cursor-pointer transition-colors duration-200"
                :class="currentMenu === tab.value
                    ? 'bg-wos-50 text-wos-800'
                    : 'bg-wos-400 text-wos-500'">
                {{ tab.label }}
            </button>
        </div>
        <div v-if="currentMenu === 'education'"
            class="rounded-3xl bg-wos-800 px-8 py-8 w-full flex flex-col gap-4 border-t-4 border-wos-50">
            <div class="flex flex-col gap-4">
                <p class="text-wos-700 font-wos text-xs text-center">
                    Choice your best schedule and add your ID. For change, talk your President or Responsabily
                </p>
                <div class="bg-wos-900 rounded-xl py-4">
                    <p class="text-wos-700 font-wos text-xs text-center">
                        Training Capacity: +200<br>Training Speed: +50%
                    </p>
                </div>
                <div class="flex flex-col gap-2">
                    <!-- Education -->
                    <div v-for="time in timeSlots" :key="time" class="relative">
                        <div v-if="educationSlots[time] && accessGranted"
                            @click="removePlayer(educationSlots[time].id, 'education')"
                            class="rounded-full w-5 h-5 bg-red-700 justify-center flex items-center text-white absolute top-[-5px] right-0  hover:cursor-pointer">
                            <span class="mt-[-5px]">-</span>
                        </div>
                        <div class="rounded-xl py-2 px-4 flex gap-2 min-h-[68px] items-center justify-between"
                            :class="educationSlots[time] ? 'bg-wos-50 text-wos-900' : 'bg-wos-600 text-wos-300'">
                            <div class="flex gap-3 items-center">
                                <img v-if="educationSlots[time]" :src="educationSlots[time].avatar_image"
                                    class="rounded-xl w-[50px] h-[50px] flex items-center justify-center bg-wos-400">
                                </img>
                                <div v-else @click="openSignupModal('education', time)"
                                    class=" rounded-xl w-[50px] h-[50px] flex items-center justify-center bg-wos-400
                                    text-lime-400 text-2xl font-black">
                                    +
                                </div>
                                <div class="flex flex-col gap-1">
                                    <p class=" font-wos text-xs">
                                        {{ educationSlots[time] ? educationSlots[time].player_name : 'Slot_Empty' }}
                                    </p>
                                    <p class="font-wos text-xs">
                                        {{ time }} UTC
                                    </p>
                                </div>
                            </div>
                            <div v-if="educationSlots[time]">
                                <span class="text-wos-900 font-wos text-xs">{{ educationSlots[time].player_id }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else-if="currentMenu === 'vicePresident'"
            class="rounded-3xl bg-wos-800 px-8 py-8 w-full flex flex-col gap-4 border-t-4 border-wos-50">
            <div class="flex flex-col gap-4 ">
                <p class="text-wos-700 font-wos text-xs text-center">
                    Choice your best schedule and add your ID. For change, talk your President or Responsabily
                </p>
                <div class="bg-wos-900 rounded-xl py-4">
                    <p class="text-wos-700 font-wos text-xs text-center">
                        Construction Speed: +10%<br>
                        Search Speed: +10%<br>
                        Training Speed: +10%<br>
                    </p>
                </div>
                <div class="flex flex-col gap-2">
                    <!-- Vice President -->
                    <div v-for="time in timeSlots" :key="time" class="relative">
                        <div v-if="vicePresidentSlots[time] && accessGranted"
                            @click="removePlayer(vicePresidentSlots[time].id, 'vicePresident')"
                            class="rounded-full w-5 h-5 bg-red-700 justify-center flex items-center text-white absolute top-[-5px] right-0 hover:cursor-pointer">
                            <span class="mt-[-5px]">-</span>
                        </div>
                        <div class="rounded-xl py-2 px-4 flex gap-2 min-h-[68px] items-center justify-between"
                            :class="vicePresidentSlots[time] ? 'bg-wos-50 text-wos-900' : 'bg-wos-600 text-wos-300'">

                            <div class="flex gap-3 items-center">
                                <img v-if="vicePresidentSlots[time]" :src="vicePresidentSlots[time].avatar_image"
                                    class="rounded-xl w-[50px] h-[50px] flex items-center justify-center bg-wos-400">
                                </img>
                                <div v-else @click="openSignupModal('vicePresident', time)"
                                    class="rounded-xl w-[50px] h-[50px] flex items-center justify-center bg-wos-400 text-lime-400 text-2xl font-black">
                                    +
                                </div>

                                <div class="flex flex-col gap-1">
                                    <p class=" font-wos text-xs">
                                        {{ vicePresidentSlots[time] ? vicePresidentSlots[time].player_name :
                                            'Slot_Empty' }}
                                    </p>
                                    <p class="font-wos text-xs">
                                        {{ time }} UTC
                                    </p>
                                </div>
                            </div>
                            <div v-if="vicePresidentSlots[time]">
                                <span class="text-wos-900 font-wos text-xs">{{
                                    vicePresidentSlots[time].player_id }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else-if="currentMenu === 'config'"
            class="rounded-3xl bg-wos-800 px-8 py-8 w-full flex flex-col gap-4 border-t-4 border-wos-50">
            <div class="flex flex-col gap-4">
                <p class="text-wos-700 font-wos text-xs text-center">
                    This area is reserved for the President
                    To manage slots, add the access key created when you generated the link. By placing it here, you can
                    go
                    back and remove the players, freeing up the slot again.
                </p>
                <div class="flex flex-col gap-2">
                    <div class="flex flex-col gap-1 items-center">
                        <label class="text-xs" for="accessKey">Access Key</label>
                        <input id="accessKey" type="text" v-model="accessKey"
                            class="rounded-xl bg-wos-500 px-4 py-1 w-full text-wos-900" />
                        <button @click="verifyAccessKey" :disabled="loading"
                            class="rounded-2xl border-b-3 hover:cursor-pointer hover:from-wosbutton-yh50  hover:to-wosbutton-yh100 border-wosbutton-yb bg-linear-to-t from-wosbutton-y50 to-wosbutton-y100 shadow-md inset-shadow-sm inset-shadow-white/60 px-9 py-2.5 text-wosbutton-yb w-fit">
                            <template v-if="loading">
                                Checking...
                            </template>
                            <template v-else>
                                Check access key
                            </template>
                        </button>
                    </div>
                </div>
                <div v-if="accessGranted">
                    <p class="text-xl text-center text-green-500">Access Granted</p>
                </div>
            </div>
        </div>
        <p class="text-wos-700 font-wos font-light text-[0.675em] text-center">
            This project was developed by the ᴹᴬᴺᴱᴿᴼ of the state 1898 to help presidents organize the schedules of each
            player during the preparation of the SvS
        </p>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios'; // Import Axios
import CryptoJS from 'crypto-js';

const route = useRoute();
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const wosKey = import.meta.env.VITE_WOS_API_SECRET_KEY || process.env.WOS_API_SECRET_KEY || 'YOUR_SECRET_KEY_HERE';

const loading = ref(true);
const errorMessage = ref(null);
const linkData = ref(null);

const showSignupModal = ref(false);
const signupPlayerId = ref('');
const modalPlayerId = ref('');
const modalRole = ref('');
const modalTime = ref('');

const currentMenu = ref('vicePresident'); // Default to 'vicePresident'

const educationSlots = ref({});
const vicePresidentSlots = ref({});
const timeSlots = ref([]);

const accessKey = ref('');
const accessGranted = ref(false);

// Sempre que accessGranted mudar, salva no localStorage
watch(accessGranted, (newVal) => {
    localStorage.setItem('wosAccessGranted', newVal ? 'true' : 'false');
});

function openSignupModal(role, time) {
    modalRole.value = role;
    modalTime.value = time;
    modalPlayerId.value = '';
    showSignupModal.value = true;
}

// Fecha modal
function closeSignupModal() {
    showSignupModal.value = false;
    modalPlayerId.value = '';
}

// Confirma o cadastro
async function confirmSignup() {
    if (!modalPlayerId.value.trim()) {
        errorMessage.value = 'Por favor, informe o ID do jogador.';
        setTimeout(() => (errorMessage.value = ''), 3000);
        return;
    }

    signupPlayerId.value = modalPlayerId.value.trim();
    showSignupModal.value = false;

    // Chama o signup com os dados do modal
    await signupPlayer(modalRole.value, modalTime.value);
}

const tabs = [
    { label: 'Education', value: 'education' },
    { label: 'Vice President', value: 'vicePresident' },
    { label: 'Config', value: 'config' }
];

const generateSign = (data) => {
    const sortedKeys = Object.keys(data).sort();
    const signStr = sortedKeys.map(key => `${key}=${data[key]}`).join('&') + wosKey;
    return CryptoJS.MD5(signStr).toString();
};

async function fetchLinkData() {
    loading.value = true;

    try {
        const id = route.params.id;
        const { data, error } = await supabase
            .from('links')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        linkData.value = data;
    } catch (err) {
        console.error('Error fetching link data:', err);
        errorMessage.value = 'Failed to load link information.';
    } finally {
        loading.value = false;
    }
}

async function fetchSlots() {
    loading.value = true;

    try {
        const id = route.params.id;
        const { data, error } = await supabase
            .from('slots')
            .select('*')
            .eq('link_id', id);

        if (error) throw error;


        educationSlots.value = {};
        vicePresidentSlots.value = {};


        data.forEach(slot => {
            if (slot.role === 'education') {
                educationSlots.value[slot.time_slot] = slot;
            } else if (slot.role === 'vicePresident') {
                vicePresidentSlots.value[slot.time_slot] = slot;
            }
        });

    } catch (err) {
        console.error('Error fetching slots:', err);
        errorMessage.value = 'Failed to load slots.';
    } finally {
        loading.value = false;
    }
}

const generateTimeSlots = () => {
    const slots = [];
    for (let h = 0; h < 24; h++) {
        for (let m = 0; m < 60; m += 30) {
            const startHour = String(h).padStart(2, '0');
            const startMinute = String(m).padStart(2, '0');
            const endHour = String(h + (m === 30 ? 1 : 0)).padStart(2, '0');
            const endMinute = String((m + 30) % 60).padStart(2, '0');
            slots.push(`${startHour}:${startMinute} - ${endHour}:${endMinute}`);
        }
    }
    timeSlots.value = slots;
};

const getPlayerInfo = async (playerId) => {
    const data = {
        fid: playerId,
        time: Date.now(),
    };

    try {
        const signedData = { ...data, sign: generateSign(data) };
        const response = await axios.post('https://wos-giftcode-api.centurygame.com/api/player', signedData);

        if (response.data.err_code === 40004) {
            console.warn(`Player ID ${playerId} not found: ${response.data.msg}`);
            return null;
        }

        if (response.data.err_code === 40001) {
            throw new Error('Invalid player ID format.');
        }

        if (response.data.data && response.data.data.nickname) {
            return {
                nickname: response.data.data.nickname || 'Unknown Player',
                stove_lv_content: response.data.data.stove_lv_content || null,
                stove_lv: response.data.data.stove_lv || null,
                avatar_image: response.data.data.avatar_image || null
            };
        } else {
            console.warn(`API returned unexpected successful response for ID ${playerId}:`, response.data);
            return null;
        }

    } catch (err) {
        console.error(`Error fetching player info for ID ${playerId}:`, err);
        return null;
    }
};

const signupPlayer = async (currentSignupRole, time) => {
    const id = route.params.id;

    //   if (!signupPlayerId.value.trim()) {
    //     signupError.value = 'Player ID is required.';
    //     loading.value = false;
    //     return;
    //   }

    //   const trimmedPlayerId = signupPlayerId.value.trim();
    //   if (isNaN(parseFloat(trimmedPlayerId)) || !/^\d+$/.test(trimmedPlayerId)) {
    //     signupError.value = 'The player ID must be a valid number.';
    //     loading.value = false;
    //     return;
    //   }

    //   if (playerHasSlot(signupRoleCurrent.value)) {
    //     errorMessage.value = `You are already signed up as ${signupRoleCurrent.value === 'education' ? 'Minister of Education' : 'Vice President'} for this link.`;
    //     loading.value = false;
    //     return;
    //   }

    try {
        const playerInfo = await getPlayerInfo(signupPlayerId.value);

        if (!playerInfo) {
            errorMessage.value = 'Invalid or unknown player ID.';
            setTimeout(() => errorMessage.value = '', 3000);
            loading.value = false;
            return;
        }

        // Use o nickname retornado pela API para garantir a consistência
        const finalPlayerName = playerInfo.nickname;

        const { error } = await supabase
            .from('slots')
            .insert({
                link_id: id,
                role: currentSignupRole,
                time_slot: time,
                player_name: finalPlayerName, // Usando o nome da API
                player_id: signupPlayerId.value,
                stove_lv_content: playerInfo.stove_lv_content,     // Novo campo
                stove_lv: playerInfo.stove_lv,     // Novo campo
                avatar_image: playerInfo.avatar_image // Novo campo
                // Adicione outros campos aqui conforme você adicionou na sua tabela
            });

        if (error) {
            if (error.code === '23505') {
                errorMessage.value = 'This time slot is already taken or you are already signed up for this role.';
                setTimeout(() => errorMessage.value = '', 3000);
            } else {
                throw error;
            }
        } else {
            errorMessage.value = 'Sign up successful!';
            setTimeout(() => errorMessage.value = '', 3000);
            await fetchSlots();
        }
    } catch (error) {
        console.error('Error signing up player:', error);
        errorMessage.value = `Error signing up: ${error.message}`;
    } finally {
        loading.value = false;
    }
};

const verifyAccessKey = async () => {

    if (!accessKey.value.trim()) {
        errorMessage.value = 'Please enter the access key.';
        return;
    }

    try {

        const id = route.params.id;
        const { data, error } = await supabase
            .from('links')
            .select('id')
            .eq('id', id)
            .eq('access_key', accessKey.value)
            .single();

        if (error || !data) {
            errorMessage.value = 'Invalid access key.';
            setTimeout(() => errorMessage.value = '', 3000);
        } else {
            // THIS IS THE CRITICAL LINE
            accessGranted.value = true;
            errorMessage.value = 'President access granted!';
            // Salvando localmente também (redundante, mas ok)
            localStorage.setItem(`wosAccessKey_${id}`, accessKey.value);
            localStorage.setItem(`wosAccessGranted_${id}`, 'true');
            setTimeout(() => errorMessage.value = '', 3000);
            accessKey.value = ''; // Limpa o campo de acesso após a verificação
        }
    } catch (error) {
        console.error('Error verifying access key:', error);
        errorMessage.value = 'Error verifying access key.';
        setTimeout(() => errorMessage.value = '', 3000);
        accessGranted.value = false;
    }
};

const removePlayer = async (slotId, role) => {
    loading.value = true;
    const id = route.params.id;

    // Pega o accessKey direto do localStorage
    const storedAccessKey = localStorage.getItem(`wosAccessKey_${id}`);


    if (!storedAccessKey) {
        errorMessage.value = 'President access key not provided or invalid.';
        setTimeout(() => errorMessage.value = '', 3000);
        loading.value = false;
        return;
    }

    try {
        // Verifica a chave no banco usando o accessKey do localStorage
        const { data: linkData, error: linkError } = await supabase
            .from('links')
            .select('id')
            .eq('id', id)
            .eq('access_key', storedAccessKey)
            .single();

        if (linkError || !linkData) {
            errorMessage.value = 'Invalid President access key for this link.';
            setTimeout(() => errorMessage.value = '', 3000);
            loading.value = false;
            return;
        }

        const { error } = await supabase
            .from('slots')
            .delete()
            .eq('id', slotId);

        if (error) throw error;

        errorMessage.value = 'Player removed successfully!';
        setTimeout(() => errorMessage.value = '', 3000);
        await fetchSlots();
    } catch (error) {
        console.error('Error removing player:', error);
        errorMessage.value = `Error removing player: ${error.message}`;
        setTimeout(() => errorMessage.value = '', 3000);
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    generateTimeSlots();
    fetchLinkData();
    fetchSlots();

    const storedAccessKey = localStorage.getItem(`wosAccessKey_${route.params.id}`);
    const storedGranted = localStorage.getItem(`wosAccessGranted_${route.params.id}`);

    if (storedAccessKey) accessKey.value = storedAccessKey;
    if (storedGranted === 'true') accessGranted.value = true;
});


</script>
