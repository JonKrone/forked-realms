import Replicate from 'replicate'

export const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY,
})

export const imageModels = {
  blackForestLabs: {
    /** Slow but great quality */
    pro11: 'black-forest-labs/flux-1.1-pro',
    /** Moderate speed and good quality */
    dev: 'black-forest-labs/flux-dev',
    /** Pretty darn fast and good quality */
    schnell: 'black-forest-labs/flux-schnell',
  },
} as const
