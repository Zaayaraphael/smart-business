import { Barchart, Bar, XAxis, Yaxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const BarData = ({ data }) => (
    <ResponsiveContainer width="100%" height= {300}>
        <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <Yaxis />
            <Tooltip />
            <legend />
            <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
    </ResponsiveContainer>
);