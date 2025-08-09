<template>
  <router-view />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios'; // Import Axios
import CryptoJS from 'crypto-js'; // You'll need this for generateSign

// Supabase Client Initialization
// Substitua com suas variáveis de ambiente do Vercel
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_API_KEY || process.env.VITE_SUPABASE_API_KEY;
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

const educationDay = ref('');
const vicePresidentDay = ref('');

const showSignupModal = ref(false);
const currentSignupRole = ref('');
const currentSignupSlot = ref('');
const signupPlayerId = ref('');
const signupError = ref('');

const inputAccessKey = ref('');
const accessKeyError = ref('');

// Computed property to calculate slots remaining
const slotsRemainingCount = () => {
  if (!linkId.value) return 0;

  const educationCount = Object.keys(educationSlots.value).length;
  const vicePresidentCount = Object.keys(vicePresidentSlots.value).length;

  const totalSlots = timeSlots.value.length;
  const maxEducationSlots = Math.floor(totalSlots / 2); // Assuming half for education
  const maxVicePresidentSlots = Math.ceil(totalSlots / 2); // Assuming half for vice president

  return {
    education: maxEducationSlots - educationCount,
    vice_president: maxVicePresidentSlots - vicePresidentCount
  };
};

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

  // --- NEW ID GENERATION LOGIC ---
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(today.getDate()).padStart(2, '0');
  const dateSegment = `${year}${month}${day}`;

  // Sanitize link name for URL-friendly segment
  const sanitizedName = newLinkName.value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except alphanumeric, spaces, and hyphens
    .trim()
    .replace(/\s+/g, '-'); // Replace spaces with hyphens

  const nameSegment = sanitizedName
    .substring(0, 15)
    .replace(/^-+|-+$/g, '') // remove hífens no início/fim
    .replace(/--+/g, '-');  // evita hífens duplos no meio

  // Generate 4 random alphanumeric characters
  const randomChars = Math.random().toString(36).substring(2, 6); // Gets 4 random alphanumeric chars

  const customLinkId = `${dateSegment}-${nameSegment}-${randomChars}`;
  // --- END NEW ID GENERATION LOGIC ---

  const newAccessKey = uuidv4(); // Access key can remain a UUID for strong uniqueness

  // Adicionar validação para as novas datas
  if (!educationDay.value || !vicePresidentDay.value) {
    errorMessage.value = 'Please select the day and month for both ministries.';
    loading.value = false;
    return;
  }


  try {
    const { data, error } = await supabase
      .from('links')
      .insert({
        id: customLinkId, // Use the new custom ID here
        name: newLinkName.value,
        access_key: newAccessKey,// Novos campos de data sendo inseridos
        education_date: educationDay.value,
        vice_president_date: vicePresidentDay.value
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Unique violation error code
        // Handle potential ID collision (unlikely with random suffix, but good to plan)
        errorMessage.value = 'A link with a very similar ID already exists. Please try again or slightly modify the name.';
        loading.value = false;
        return;
      }
      throw error;
    }

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

const linkEducationDate = ref('');
const linkVicePresidentDate = ref('');

const fetchLinkDetails = async () => {
  errorMessage.value = '';
  loading.value = true;
  try {
    const { data, error } = await supabase
      .from('links')
      .select('name, education_date, vice_president_date')
      .eq('id', linkId.value)
      .single();

    if (error) throw error;
    currentLinkName.value = data.name;
    linkEducationDate.value = data.education_date;       // Atribuir o valor
    linkVicePresidentDate.value = data.vice_president_date; // Atribuir o valor

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

  const trimmedPlayerId = signupPlayerId.value.trim();
  if (isNaN(parseFloat(trimmedPlayerId)) || !/^\d+$/.test(trimmedPlayerId)) {
    signupError.value = 'The player ID must be a valid number.';
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
  slotsRemainingCount();

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

<style>

</style>
