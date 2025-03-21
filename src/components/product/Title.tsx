import { Link } from "react-router-dom";

interface BreadcrumbItem {
    label: string;
    path?: string;
}

interface TitleProps {
    title: string;
    breadcrumb: BreadcrumbItem[];
}

const Title: React.FC<TitleProps> = ({ title, breadcrumb }) => {
    return (
        <div className=" relative bg-cyan-700 h-[150px] mt-2 flex flex-col items-center justify-center">
            <h1 className="text-4xl text-white font-bold">{title}</h1>
            <nav className="mt-2">
                <ul className="flex text-white text-sm space-x-2">
                    {breadcrumb.map((item, index) => (
                        <li key={index} className={index === breadcrumb.length - 1 ? "text-gray-300" : ""}>
                            {item.path ? (
                                <Link to={item.path} className="hover:text-gray-300">
                                    {item.label}
                                </Link>
                            ) : (
                                item.label
                            )}
                            {index < breadcrumb.length - 1 && <span className="mx-2">/</span>}
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default Title;
