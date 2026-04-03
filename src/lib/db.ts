// In-memory database (super fast, no PostgreSQL needed)
export const restaurants = [
  {
    id: "1",
    name: "Pizza Palace",
    type: "restaurant",
    tier: "essential",
    ownerName: "John Doe",
    ownerPhone: "+8801234567890",
    status: "active",
    agents: [
      { id: "advisor", name: "Business Advisor", role: "advisor", model: "claude-4-sonnet", cost: 0 },
    ],
    budget: 500,
    spent: 45.30,
  },
  {
    id: "2",
    name: "Burger Barn",
    type: "burger",
    tier: "complete",
    ownerName: "Sarah Smith",
    ownerPhone: "+8809876543210",
    status: "active",
    agents: [
      { id: "advisor", name: "Business Advisor", role: "advisor", model: "claude-4-sonnet", cost: 0 },
      { id: "researcher", name: "Researcher", role: "researcher", model: "deepseek-r1", cost: 0 },
      { id: "writer", name: "Content Writer", role: "writer", model: "gpt-5.4-nano", cost: 0 },
      { id: "marketing", name: "Marketing Agent", role: "marketing", model: "gpt-5.4", cost: 0 },
      { id: "designer", name: "Designer", role: "designer", model: "dall-e-3", cost: 0 },
    ],
    budget: 1000,
    spent: 123.45,
  }
];

export default restaurants;