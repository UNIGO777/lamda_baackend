/**
 * Links API Usage Examples
 * This file demonstrates how to use the Links API endpoints
 */

const axios = require('axios');

// Base URL for the API
const BASE_URL = 'http://localhost:3000/api/links';

// Example user ID (in real app, this would come from authentication)
const USER_ID = '507f1f77bcf86cd799439011';

// Example link data
const sampleLinkData = {
  url: 'https://www.linkedin.com/in/johndoe',
  originalUrl: 'https://www.linkedin.com/in/johndoe',
  linkType: 'social',
  title: 'John Doe - Software Engineer',
  description: 'Experienced software engineer specializing in full-stack development',
  images: {
    logo: 'https://cdn-icons-png.flaticon.com/512/174/174857.png',
    ogImage: 'https://media.licdn.com/dms/image/profile-image.jpg',
    favicon: 'https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca',
    appleTouchIcon: 'https://static.licdn.com/sc/h/akt4ae504epesldzj74dzred8'
  },
  metadata: {
    domain: 'linkedin.com',
    statusCode: 200,
    statusText: 'OK',
    method: 'GET',
    contentType: 'text/html',
    responseTime: 1250,
    attempt: 1
  },
  tags: ['professional', 'networking', 'career'],
  notes: 'Potential candidate for senior developer position'
};

/**
 * 1. Create a new link
 */
async function createLink() {
  try {
    console.log('🔗 Creating a new link...');
    
    const response = await axios.post(BASE_URL, sampleLinkData, {
      headers: {
        'user-id': USER_ID,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Link created successfully:');
    console.log(JSON.stringify(response.data, null, 2));
    return response.data.data._id;
  } catch (error) {
    console.error('❌ Error creating link:', error.response?.data || error.message);
  }
}

/**
 * 2. Get all links for a user
 */
async function getUserLinks() {
  try {
    console.log('📋 Getting all user links...');
    
    const response = await axios.get(BASE_URL, {
      headers: {
        'user-id': USER_ID
      },
      params: {
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      }
    });
    
    console.log('✅ User links retrieved:');
    console.log(`Total: ${response.data.pagination.total}`);
    console.log(`Page: ${response.data.pagination.page}/${response.data.pagination.pages}`);
    console.log('Links:', response.data.data.map(link => ({
      id: link._id,
      title: link.title,
      linkType: link.linkType,
      domain: link.metadata.domain
    })));
    
    return response.data.data;
  } catch (error) {
    console.error('❌ Error getting user links:', error.response?.data || error.message);
  }
}

/**
 * 3. Get a specific link by ID
 */
async function getLinkById(linkId) {
  try {
    console.log(`🔍 Getting link by ID: ${linkId}`);
    
    const response = await axios.get(`${BASE_URL}/${linkId}`, {
      headers: {
        'user-id': USER_ID
      }
    });
    
    console.log('✅ Link retrieved:');
    console.log(JSON.stringify(response.data.data, null, 2));
    return response.data.data;
  } catch (error) {
    console.error('❌ Error getting link by ID:', error.response?.data || error.message);
  }
}

/**
 * 4. Update a link
 */
async function updateLink(linkId) {
  try {
    console.log(`✏️ Updating link: ${linkId}`);
    
    const updateData = {
      title: 'John Doe - Senior Software Engineer (Updated)',
      tags: ['professional', 'networking', 'career', 'senior'],
      notes: 'Updated: Promoted to senior position'
    };
    
    const response = await axios.put(`${BASE_URL}/${linkId}`, updateData, {
      headers: {
        'user-id': USER_ID,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Link updated successfully:');
    console.log(JSON.stringify(response.data.data, null, 2));
    return response.data.data;
  } catch (error) {
    console.error('❌ Error updating link:', error.response?.data || error.message);
  }
}

/**
 * 5. Get links by type
 */
async function getLinksByType(linkType = 'social') {
  try {
    console.log(`🏷️ Getting links by type: ${linkType}`);
    
    const response = await axios.get(`${BASE_URL}/type/${linkType}`, {
      headers: {
        'user-id': USER_ID
      },
      params: {
        page: 1,
        limit: 10
      }
    });
    
    console.log(`✅ ${linkType} links retrieved:`, response.data.count);
    console.log('Links:', response.data.data.map(link => ({
      id: link._id,
      title: link.title,
      domain: link.metadata.domain
    })));
    
    return response.data.data;
  } catch (error) {
    console.error('❌ Error getting links by type:', error.response?.data || error.message);
  }
}

/**
 * 6. Search links
 */
async function searchLinks(query = 'software') {
  try {
    console.log(`🔍 Searching links for: "${query}"`);
    
    const response = await axios.get(`${BASE_URL}/search`, {
      headers: {
        'user-id': USER_ID
      },
      params: {
        q: query,
        page: 1,
        limit: 10
      }
    });
    
    console.log(`✅ Search results for "${query}":`, response.data.count);
    console.log('Links:', response.data.data.map(link => ({
      id: link._id,
      title: link.title,
      domain: link.metadata.domain
    })));
    
    return response.data.data;
  } catch (error) {
    console.error('❌ Error searching links:', error.response?.data || error.message);
  }
}

/**
 * 7. Get user link statistics
 */
async function getUserStats() {
  try {
    console.log('📊 Getting user link statistics...');
    
    const response = await axios.get(`${BASE_URL}/stats`, {
      headers: {
        'user-id': USER_ID
      }
    });
    
    console.log('✅ User statistics:');
    console.log(JSON.stringify(response.data.data, null, 2));
    return response.data.data;
  } catch (error) {
    console.error('❌ Error getting user stats:', error.response?.data || error.message);
  }
}

/**
 * 8. Get user tags
 */
async function getUserTags() {
  try {
    console.log('🏷️ Getting user tags...');
    
    const response = await axios.get(`${BASE_URL}/tags`, {
      headers: {
        'user-id': USER_ID
      }
    });
    
    console.log('✅ User tags:');
    console.log('Tags:', response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('❌ Error getting user tags:', error.response?.data || error.message);
  }
}

/**
 * 9. Delete a link (soft delete)
 */
async function deleteLink(linkId) {
  try {
    console.log(`🗑️ Deleting link: ${linkId}`);
    
    const response = await axios.delete(`${BASE_URL}/${linkId}`, {
      headers: {
        'user-id': USER_ID
      }
    });
    
    console.log('✅ Link deleted successfully:', response.data.message);
    return true;
  } catch (error) {
    console.error('❌ Error deleting link:', error.response?.data || error.message);
  }
}

/**
 * 10. Bulk delete links
 */
async function bulkDeleteLinks(linkIds) {
  try {
    console.log(`🗑️ Bulk deleting ${linkIds.length} links...`);
    
    const response = await axios.delete(`${BASE_URL}/bulk`, {
      headers: {
        'user-id': USER_ID,
        'Content-Type': 'application/json'
      },
      data: {
        linkIds: linkIds
      }
    });
    
    console.log('✅ Bulk delete completed:', response.data.message);
    return true;
  } catch (error) {
    console.error('❌ Error bulk deleting links:', error.response?.data || error.message);
  }
}

/**
 * Demo function to run all examples
 */
async function runDemo() {
  console.log('🚀 Starting Links API Demo...\n');
  
  try {
    // 1. Create a link
    const linkId = await createLink();
    console.log('\n' + '='.repeat(50) + '\n');
    
    if (!linkId) {
      console.log('❌ Demo stopped: Could not create link');
      return;
    }
    
    // 2. Get all user links
    await getUserLinks();
    console.log('\n' + '='.repeat(50) + '\n');
    
    // 3. Get link by ID
    await getLinkById(linkId);
    console.log('\n' + '='.repeat(50) + '\n');
    
    // 4. Update the link
    await updateLink(linkId);
    console.log('\n' + '='.repeat(50) + '\n');
    
    // 5. Get links by type
    await getLinksByType('social');
    console.log('\n' + '='.repeat(50) + '\n');
    
    // 6. Search links
    await searchLinks('software');
    console.log('\n' + '='.repeat(50) + '\n');
    
    // 7. Get user statistics
    await getUserStats();
    console.log('\n' + '='.repeat(50) + '\n');
    
    // 8. Get user tags
    await getUserTags();
    console.log('\n' + '='.repeat(50) + '\n');
    
    // 9. Delete the link
    await deleteLink(linkId);
    console.log('\n' + '='.repeat(50) + '\n');
    
    console.log('✅ Demo completed successfully!');
    
  } catch (error) {
    console.error('❌ Demo failed:', error.message);
  }
}

// Export functions for individual use
module.exports = {
  createLink,
  getUserLinks,
  getLinkById,
  updateLink,
  getLinksByType,
  searchLinks,
  getUserStats,
  getUserTags,
  deleteLink,
  bulkDeleteLinks,
  runDemo
};

// Run demo if this file is executed directly
if (require.main === module) {
  runDemo();
}