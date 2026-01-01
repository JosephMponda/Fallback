import { servicesAPI } from './services'

async function test() {
  try {
    const services = await servicesAPI.getAll()
    console.log('Services fetched:', services)
  } catch (err) {
    console.error('Services fetch failed:', err)
  }
}

test()
