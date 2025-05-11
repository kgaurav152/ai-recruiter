import CreateOptions from "./_components/CreateOptions"
import LatestInterviewsList from "./_components/LatestInterviewsList"

const Dashboard = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold my-2">Dashboard</h2>
      <CreateOptions/>
      <LatestInterviewsList/>
    </div>
  )
}

export default Dashboard
