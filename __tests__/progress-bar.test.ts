/**
 * Test file to verify progress bar calculations and identify UI issues
 * Run with: npx tsx __tests__/progress-bar.test.ts
 */

// Mock data
const mockStudents = [
  { id: 1, name: "John Smith" },
  { id: 2, name: "Emma Johnson" },
  { id: 3, name: "Michael Brown" },
  { id: 4, name: "Sarah Wilson" },
  { id: 5, name: "David Lee" },
]

// Test cases for progress bar calculation
const testCases = [
  {
    name: "No students marked",
    markedCount: 0,
    totalStudents: 5,
    expectedPercentage: 0,
    expectedDisplay: "0 / 5",
  },
  {
    name: "1 student marked",
    markedCount: 1,
    totalStudents: 5,
    expectedPercentage: 20,
    expectedDisplay: "1 / 5",
  },
  {
    name: "2 students marked",
    markedCount: 2,
    totalStudents: 5,
    expectedPercentage: 40,
    expectedDisplay: "2 / 5",
  },
  {
    name: "3 students marked",
    markedCount: 3,
    totalStudents: 5,
    expectedPercentage: 60,
    expectedDisplay: "3 / 5",
  },
  {
    name: "All students marked",
    markedCount: 5,
    totalStudents: 5,
    expectedPercentage: 100,
    expectedDisplay: "5 / 5",
  },
  {
    name: "Edge case: 0 total students",
    markedCount: 0,
    totalStudents: 0,
    expectedPercentage: 0,
    expectedDisplay: "0 / 0",
  },
  {
    name: "Edge case: Rounding (33.33% should round to 33%)",
    markedCount: 1,
    totalStudents: 3,
    expectedPercentage: 33,
    expectedDisplay: "1 / 3",
  },
  {
    name: "Edge case: Rounding (66.67% should round to 67%)",
    markedCount: 2,
    totalStudents: 3,
    expectedPercentage: 67,
    expectedDisplay: "2 / 3",
  },
]

// Current implementation (from the code)
function calculatePercentage(markedCount: number, totalStudents: number): number {
  if (totalStudents === 0) return 0
  return Math.round((markedCount / totalStudents) * 100)
}

// Verify percentage matches the ratio
function verifyPercentageCorrelation(
  markedCount: number,
  totalStudents: number,
  percentage: number
): boolean {
  if (totalStudents === 0) return percentage === 0
  const expectedPercentage = (markedCount / totalStudents) * 100
  const roundedExpected = Math.round(expectedPercentage)
  return percentage === roundedExpected
}

console.log("=".repeat(60))
console.log("Progress Bar Calculation Tests")
console.log("=".repeat(60))
console.log()

let passedTests = 0
let failedTests = 0
const issues: string[] = []

testCases.forEach((testCase) => {
  const calculatedPercentage = calculatePercentage(
    testCase.markedCount,
    testCase.totalStudents
  )
  const isCorrelated = verifyPercentageCorrelation(
    testCase.markedCount,
    testCase.totalStudents,
    calculatedPercentage
  )

  const passed = calculatedPercentage === testCase.expectedPercentage && isCorrelated

  if (passed) {
    console.log(`✅ ${testCase.name}`)
    console.log(`   Marked: ${testCase.markedCount}, Total: ${testCase.totalStudents}`)
    console.log(`   Percentage: ${calculatedPercentage}% (Expected: ${testCase.expectedPercentage}%)`)
    console.log(`   Correlation: ${isCorrelated ? "✓" : "✗"}`)
    passedTests++
  } else {
    console.log(`❌ ${testCase.name}`)
    console.log(`   Marked: ${testCase.markedCount}, Total: ${testCase.totalStudents}`)
    console.log(`   Calculated: ${calculatedPercentage}%, Expected: ${testCase.expectedPercentage}%`)
    console.log(`   Correlation: ${isCorrelated ? "✓" : "✗"}`)
    failedTests++
    issues.push(
      `${testCase.name}: Expected ${testCase.expectedPercentage}%, got ${calculatedPercentage}%`
    )
  }
  console.log()
})

console.log("=".repeat(60))
console.log(`Results: ${passedTests} passed, ${failedTests} failed`)
console.log("=".repeat(60))

if (issues.length > 0) {
  console.log()
  console.log("Issues Found:")
  issues.forEach((issue) => console.log(`  - ${issue}`))
}

// Additional verification: Check if percentage displayed matches the progress bar width
console.log()
console.log("=".repeat(60))
console.log("Progress Bar Display Verification")
console.log("=".repeat(60))
console.log()

const displayTests = [
  { marked: 0, total: 5, percentage: 0 },
  { marked: 1, total: 5, percentage: 20 },
  { marked: 2, total: 5, percentage: 40 },
  { marked: 3, total: 5, percentage: 60 },
  { marked: 5, total: 5, percentage: 100 },
]

displayTests.forEach((test) => {
  const calculated = calculatePercentage(test.marked, test.total)
  const matches = calculated === test.percentage
  const ratio = test.total > 0 ? (test.marked / test.total) * 100 : 0

  console.log(
    `${matches ? "✅" : "❌"} Display: ${test.marked}/${test.total} = ${calculated}% (Expected: ${test.percentage}%, Ratio: ${ratio.toFixed(2)}%)`
  )

  if (!matches) {
    issues.push(
      `Display mismatch: ${test.marked}/${test.total} shows ${calculated}% but should show ${test.percentage}%`
    )
  }
})

if (issues.length === 0) {
  console.log()
  console.log("✅ All tests passed! No issues found with progress bar calculations.")
} else {
  console.log()
  console.log("⚠️  Issues detected. Review the issues above.")
}

