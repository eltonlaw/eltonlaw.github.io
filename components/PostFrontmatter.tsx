import styles from '@/styles/PostFrontmatter.module.css'

function PostFrontmatter( props : any) {
  return (
    <div className="postFrontmatter">
      <h2 className={styles.postTitle}>{props.postTitle}</h2>
      <span className={styles.postDate}>{props.postDate}</span>
    </div>
  )
}

export default PostFrontmatter
