// test-resend.js
require('dotenv').config();
const { Resend } = require('resend');

const testResend = async () => {
  try {
    console.log('🔍 Testing Resend configuration...');
    
    if (!process.env.RESEND_API_KEY) {
      throw new Error('Missing RESEND_API_KEY');
    }
    
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    const { data, error } = await resend.emails.send({
      from: 'AllMyAI <noreply@allmyai.ai>', // Your custom domain
      to: ['abdullah.k10204@gmail.com'], // Change this
      subject: 'Resend Test - AllMyAI Coming Soon!',
      html: '<strong>Resend is working with your custom domain!</strong>',
    });
    
    if (error) {
      throw error;
    }
    
    console.log('✅ Resend test email sent successfully!');
    console.log('📧 Email ID:', data.id);
    
  } catch (error) {
    console.error('❌ Resend test failed:', error.message);
  }
};

testResend();