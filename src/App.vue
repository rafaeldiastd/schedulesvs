<template>

  <div class="grid grid-cols-12 gap-4">
    <p v-if="successMessage"
      class="text-green-300 text-center mt-4 fixed top-4 left-4 bg-neutral-800 rounded-2xl border border-neutral-500 px-4 py-2">
      {{ successMessage }}</p>
    <p v-if="errorMessage"
      class="text-red-300 text-center mt-4 fixed top-4 left-4 bg-neutral-800 rounded-2xl border border-neutral-500 px-4 py-2">
      {{ errorMessage }}</p>

    <div class="col-span-12 flex flex-col items-center gap-2">
      <h1 class="text-3xl font-bold text-neutral-200">
        WOS Scheduler
      </h1>
      <h2 v-if="linkId"> {{ currentLinkName }}</h2>
      <h2 v-if="!linkId"> {{ newLinkName }}</h2>

      <span class="text-md text-neutral-300 text-center">Choose the time that will be available for each ministry.
        Enter your ID and sign up. Remember to also sign up through the game.</span>
      <span class="text-xs text-neutral-300 p-2 text-center">This project was developed by the ᴹᴬᴺᴱᴿᴼ of the state 1898
        to help presidents organize the schedules of each player during the preparation of the SvS</span>
      <div v-if="!linkId && !accessKey" class="flex flex-col gap-2 bg-neutral-800 p-8 rounded-2xl  text-center">
        <h2 class="text-xl font-normal">Create new link</h2>
        <p class="text-sm text-muted-foreground">Generate a new link for players to schedule.</p>
        <div class="flex gap-2 items-center justify-center">
          <input id="linkName" v-model="newLinkName" type="text" placeholder="Name for the link"
            class="border rounded-2xl bg-neutral-800 border-neutral-600  text-white px-4 py-2" />
          <button @click="createLink" :disabled="loading"
            class="border border-blue-500 rounded-2xl bg-blue-600 text-white px-4 py-2">
            <template v-if="loading">
              Creating...
            </template>
            <template v-else>
              Create link
            </template>
          </button>
        </div>

      </div>

      <div v-if="generatedLink" class="flex flex-col gap-2 mt-4">
        <div class="p-4 flex flex-col gap-2 items-center">
          <a :href="generatedLink" class="text-green-300">{{ generatedLink }}</a>
          <button @click="copyToClipboard(generatedAccessKey)" class="rounded-2xl bg-neutral-800 text-white px-8 py-1">
            Key: {{ generatedAccessKey || 'N/A' }}
          </button>
          <span class="text-xs text-neutral-400">Keep this key safe. It is required to remove players.</span>
        </div>
      </div>


    </div>

    <div v-if="linkId" class="md:col-span-6 col-span-12 flex flex-col gap-2 bg-neutral-900 p-8 rounded-2xl">
      <h2 class="text-2xl font-bold text-amber-500 text-center">Minister Education</h2>
      <p class="text-xs text-neutral-300 text-center pb-4">Training Capacity: +200 <br />Training Speed: +50%</p>
      <div v-for="slot in timeSlots" :key="`education - ${slot}`">
        <template v-if="educationSlots[slot]">
          <div class="flex gap-2">
            <div
              class="w-full flex items-center justify-between gap-2 text-center border border-neutral-700 rounded-2xl bg-neutral-800 text-neutral-500 px-4 py-2">
              <div class="flex items-center gap-2">
                <img :src="educationSlots[slot].avatar_image" alt="Avatar" class="w-6 h-6 rounded-full" />
                <img :src="educationSlots[slot].stove_lv_content" alt="Stove Level" class="w-6 h-6 rounded-full" />
                <span class=""> {{ educationSlots[slot].player_name }}</span>
              </div>
              <span class="">{{ educationSlots[slot].player_id }}</span>
            </div>
            <button v-if="accessKey" @click="removePlayer(educationSlots[slot].id, 'education')"
              class="border border-red-400 rounded-2xl bg-red-600 text-white p-2">
              <XIcon class="w-4 h-4" />
            </button>
          </div>
        </template>
        <template v-else>
          <button v-if="linkId" @click="openSignupModal('education', slot)" :disabled="playerHasSlot('education')"
            class=" w-full border border-neutral-700 rounded-2xl bg-neutral-800 text-white px-4 py-2">{{ slot }}
            UTC</button>
        </template>
      </div>
    </div>
    <div v-if="linkId" class="md:col-span-6 col-span-12 flex flex-col gap-2 bg-neutral-900 p-8 rounded-2xl">
      <h2 class="text-2xl font-bold text-amber-500 text-center">Vice President</h2>
      <p class="text-xs text-neutral-300 text-center pb-4"> Construction Speed: +10% <br /> Search Speed: +10% <br />
        Training Speed: +10%</p>
      <div v-for="slot in timeSlots" :key="`vice - president - ${slot}`">
        <template v-if="vicePresidentSlots[slot]">
          <div class="flex gap-2">
             <div
              class="w-full flex items-center justify-between gap-2 text-center border border-neutral-700 rounded-2xl bg-neutral-800 text-neutral-500 px-4 py-2">
              <div class="flex items-center gap-2">
                <img :src="vicePresidentSlots[slot].avatar_image" alt="Avatar" class="w-6 h-6 rounded-full" />
                <img v-if="vicePresidentSlots[slot].stove_lv_content" :src="vicePresidentSlots[slot].stove_lv_content" alt="Stove Content Level" class="w-6 h-6 rounded-full" />
                <span v-else="vicePresidentSlots[slot].stove_lv" alt="Stove Level" class="w-6 h-6 rounded-full"> {{ vicePresidentSlots[slot].stove_lv }}</span>
                <span class=""> {{ vicePresidentSlots[slot].player_name }}</span>
              </div>
              <span class="">{{ vicePresidentSlots[slot].player_id }}</span>
            </div>
          </div>
        </template>
        <template v-else>

          <button v-if="linkId" @click="openSignupModal('vice_president', slot)"
            :disabled="playerHasSlot('vice_president')"
            class=" w-full border border-neutral-700 rounded-2xl bg-neutral-800 text-white px-4 py-2">
            {{ slot }} UTC
          </button>
        </template>
      </div>
    </div>
    <div v-if="linkId" class="flex col-span-full gap-2 items-center py-8 border-t border-neutral-700">
      <input v-model="inputAccessKey" type="password" placeholder="President Key"
        class="border rounded-2xl bg-neutral-800 border-neutral-600  text-white px-4 py-2" />

      <button @click="verifyAccessKey" class="border border-blue-500 rounded-2xl bg-blue-600 text-white px-4 py-2">
        Check Access Key
      </button>
      <p v-if="accessKeyError" class="text-red-500 text-sm mt-2">{{ accessKeyError }}</p>

    </div>

    <div v-if="showSignupModal" class="fixed top-auto left-auto bg-neutral-800 p-6 z-50 rounded-2xl">
      <h2 class="text-xl font-normal">Sign up for {{ currentSignupRole === 'education' ? 'Minister Education' :
        'Vice President' }}</h2>
      <p class="text-sm text-muted-foreground">Selected time: {{ currentSignupSlot }} UTC </p>
      <div class="grid gap-4 py-4">
        <div class="flex flex-col gap-1">
          <input id="playerId" v-model="signupPlayerId" type="text" placeholder="Player ID"
            class="border rounded-2xl bg-neutral-800 border-neutral-600  text-white px-4 py-2" />
        </div>
        <div class="flex items-center justify-between gap-2 mt-4">
          <button @click="closeSignupModal" class="border border-neutral-500 rounded-2xl  text-white px-4 py-2">
            Cancel
          </button>
          <button @click="signupPlayer" :disabled="loading"
            class="border border-blue-500 rounded-2xl bg-blue-600 text-white px-4 py-2">
            <template v-if="loading">
              Loading...
            </template>
            <template v-else>
              Sign up
            </template>
          </button>
        </div>
        <p v-if="signupError" class="text-red-500 text-sm">{{ signupError }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { XIcon } from 'lucide-vue-next';
import axios from 'axios'; // Import Axios
import CryptoJS from 'crypto-js'; // You'll need this for generateSign

// Supabase Client Initialization
// Substitua com suas variáveis de ambiente do Vercel
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const wosKey = import.meta.env.VITE_WOS_API_SECRET_KEY || process.env.WOS_API_SECRET_KEY || 'YOUR_SECRET_KEY_HERE';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// State Variables
const newLinkName = ref('');
const generatedLink = ref('');
const generatedAccessKey = ref('');
const loading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const linkId = ref('');
const accessKey = ref('');
const currentLinkName = ref('Loading...');

const timeSlots = ref([]);
const educationSlots = ref({});
const vicePresidentSlots = ref({});

const showSignupModal = ref(false);
const currentSignupRole = ref('');
const currentSignupSlot = ref('');
const signupPlayerId = ref('');
const signupError = ref('');

const inputAccessKey = ref('');
const accessKeyError = ref('');


const generateSign = (data) => {
  const sortedKeys = Object.keys(data).sort();
  const signStr = sortedKeys.map(key => `${key}=${data[key]}`).join('&') + wosKey;
  return CryptoJS.MD5(signStr).toString();
};

const login = async (playerId) => {
  const loginData = {
    fid: playerId,
    time: Date.now(),
  };

  try {
    const signedData = { ...loginData, sign: generateSign(loginData) };
    const response = await axios.post('https://wos-giftcode-api.centurygame.com/api/player', signedData);

    if (response.data.err_code === 40009) {
      throw new Error('User not logged in. Please login first.');
    }

    return true;
  } catch (err) {
    console.error(`Login failed for Player ID ${playerId}`, err);
    return false;
  }
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

const playerHasSlot = (role) => {
  const playerId = signupPlayerId.value;
  if (!playerId) return false;

  if (role === 'education') {
    return Object.values(educationSlots.value).some(slot => slot.player_id === playerId);
  } else if (role === 'vice_president') {
    return Object.values(vicePresidentSlots.value).some(slot => slot.player_id === playerId);
  }
  return false;
};

// Functions
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

const createLink = async () => {
  errorMessage.value = '';
  successMessage.value = '';
  loading.value = true;

  if (!newLinkName.value.trim()) {
    errorMessage.value = 'Please enter a name for the link.';
    loading.value = false;
    return;
  }

  const newAccessKey = uuidv4();
  try {
    const { data, error } = await supabase
      .from('links')
      .insert({ name: newLinkName.value, access_key: newAccessKey })
      .select()
      .single();

    if (error) throw error;

    generatedLink.value = `${window.location.origin}?linkId=${data.id}`;
    generatedAccessKey.value = newAccessKey;
    successMessage.value = 'Link created successfully!';
    setTimeout(() => successMessage.value = '', 3000);
  } catch (error) {
    console.error('Error creating link:', error);
    errorMessage.value = `Error creating link: ${error.message}`;
  } finally {
    loading.value = false;
  }
};

const fetchLinkDetails = async () => {
  errorMessage.value = '';
  loading.value = true;
  try {
    const { data, error } = await supabase
      .from('links')
      .select('name')
      .eq('id', linkId.value)
      .single();

    if (error) throw error;
    currentLinkName.value = data.name;
  } catch (error) {
    console.error('Error fetching link details:', error);
    errorMessage.value = `Link not found or error: ${error.message}`;
    setTimeout(() => errorMessage.value = '', 3000);

    linkId.value = null; // Clear linkId to show President view
  } finally {
    loading.value = false;
  }
};

const fetchSlots = async () => {
  errorMessage.value = '';
  loading.value = true;
  try {
    const { data, error } = await supabase
      .from('slots')
      .select('*')
      .eq('link_id', linkId.value);

    if (error) throw error;

    educationSlots.value = {};
    vicePresidentSlots.value = {};

    data.forEach(slot => {
      if (slot.role === 'education') {
        educationSlots.value[slot.time_slot] = slot;
      } else if (slot.role === 'vice_president') {
        vicePresidentSlots.value[slot.time_slot] = slot;
      }
    });
  } catch (error) {
    console.error('Error fetching slots:', error);
    errorMessage.value = `Error loading time slots: ${error.message}`;
    setTimeout(() => errorMessage.value = '', 3000);
  } finally {
    loading.value = false;
  }
};

const openSignupModal = (role, slot) => {
  currentSignupRole.value = role;
  currentSignupSlot.value = slot;
  signupPlayerId.value = '';
  signupError.value = '';
  showSignupModal.value = true;
};

const closeSignupModal = () => {
  showSignupModal.value = false;
  signupPlayerId.value = '';
  signupError.value = '';
};

const signupPlayer = async () => {
  signupError.value = '';
  loading.value = true;

  if (!signupPlayerId.value.trim()) {
    signupError.value = 'Player ID is required.';
    loading.value = false;
    return;
  }

  if (playerHasSlot(currentSignupRole.value)) {
    signupError.value = `You are already signed up as ${currentSignupRole.value === 'education' ? 'Minister of Education' : 'Vice President'} for this link.`;
    loading.value = false;
    return;
  }

  try {
    const playerInfo = await getPlayerInfo(signupPlayerId.value);

    if (!playerInfo) {
      signupError.value = 'Invalid or unknown player ID.';
      loading.value = false;
      return;
    }

    // Use o nickname retornado pela API para garantir a consistência
    const finalPlayerName = playerInfo.nickname;

    const { error } = await supabase
      .from('slots')
      .insert({
        link_id: linkId.value,
        role: currentSignupRole.value,
        time_slot: currentSignupSlot.value,
        player_name: finalPlayerName, // Usando o nome da API
        player_id: signupPlayerId.value,
        stove_lv_content: playerInfo.stove_lv_content,     // Novo campo
        stove_lv: playerInfo.stove_lv,     // Novo campo
        avatar_image: playerInfo.avatar_image // Novo campo
        // Adicione outros campos aqui conforme você adicionou na sua tabela
      });

    if (error) {
      if (error.code === '23505') {
        signupError.value = 'This time slot is already taken or you are already signed up for this role.';
      } else {
        throw error;
      }
    } else {
      successMessage.value = 'Sign up successful!';
      setTimeout(() => successMessage.value = '', 3000);
      closeSignupModal();
      await fetchSlots();
    }
  } catch (error) {
    console.error('Error signing up player:', error);
    signupError.value = `Error signing up: ${error.message}`;
  } finally {
    loading.value = false;
  }
};

const removePlayer = async (slotId, role) => {
  errorMessage.value = '';
  successMessage.value = '';
  loading.value = true;

  // Client-side access key verification (less secure, for demo purposes)
  if (!accessKey.value) {
    errorMessage.value = 'President access key not provided or invalid.';
    setTimeout(() => errorMessage.value = '', 3000);
    loading.value = false;
    return;
  }

  try {
    // Verify access key against the database
    const { data: linkData, error: linkError } = await supabase
      .from('links')
      .select('id')
      .eq('id', linkId.value)
      .eq('access_key', accessKey.value)
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

    successMessage.value = 'Player removed successfully!';
    setTimeout(() => successMessage.value = '', 3000);
    await fetchSlots(); // Refresh slots
  } catch (error) {
    console.error('Error removing player:', error);
    errorMessage.value = `Error removing player: ${error.message}`;
    setTimeout(() => errorMessage.value = '', 3000);
  } finally {
    loading.value = false;
  }
};

const verifyAccessKey = async () => {
  accessKeyError.value = '';
  errorMessage.value = '';
  successMessage.value = '';

  if (!inputAccessKey.value.trim()) {
    accessKeyError.value = 'Please enter the access key.';
    return;
  }

  try {
    const { data, error } = await supabase
      .from('links')
      .select('id')
      .eq('id', linkId.value)
      .eq('access_key', inputAccessKey.value)
      .single();

    if (error || !data) {
      accessKeyError.value = 'Invalid access key.';
      setTimeout(() => accessKeyError.value = '', 3000);
    } else {
      accessKey.value = inputAccessKey.value;
      successMessage.value = 'President access granted!';
      setTimeout(() => successMessage.value = '', 3000);
      inputAccessKey.value = ''; // Clear input
    }
  } catch (error) {
    console.error('Error verifying access key:', error);
    accessKeyError.value = 'Error verifying access key.';
    setTimeout(() => accessKeyError.value = '', 3000);
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

// On component mount
onMounted(() => {
  generateTimeSlots();
  const urlParams = new URLSearchParams(window.location.search);
  const idFromUrl = urlParams.get('linkId');
  const keyFromUrl = urlParams.get('accessKey'); // Optional: for direct admin link

  if (idFromUrl) {
    linkId.value = idFromUrl;
    if (keyFromUrl) {
      accessKey.value = keyFromUrl;
      inputAccessKey.value = keyFromUrl; // Pre-fill for convenience
      verifyAccessKey(); // Automatically verify if key is in URL
    }
    fetchLinkDetails();
    fetchSlots();
  }
});
</script>

<style></style>
